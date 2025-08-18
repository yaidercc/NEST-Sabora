import { GeneralRole } from "src/user/entities/general_role.entity";
import { TestingModule } from "@nestjs/testing";
import { BadRequestException, INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { EmployeeRoles, GeneralRoles } from "src/common/enums/roles";
import { UserMother } from "src/user/tests/userMother";
import { AdminLogin, TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TableMother } from "src/table/tests/tableMother";
import { ReservationMother } from "./reservationMother";
import * as dayjs from "dayjs";
import { Status } from "../enum/status";

describe("E2E test ReservationService", () => {
    let module: TestingModule;
    let app: INestApplication
    let clientRole: GeneralRole | null
    let adminLogin: AdminLogin | undefined
    let services: TestServices
    let repositories: TestRepositories

    beforeAll(async () => {
        const testDB = await TestDatabaseManager.initializeE2E()
        app = testDB.app
        module = testDB.module

        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    beforeEach(async () => {
        adminLogin = await TestHelpers.loginAsAdmin(app);
        clientRole = await repositories.generalRoleRepository.findOneBy({ name: GeneralRoles.CLIENT })
    })

    afterAll(async () => {
        await TestDatabaseManager.cleanUp();
    });

    afterEach(async () => {
        await services.seedService.executeSEED();
        jest.restoreAllMocks();
    });

    it("Should create a reservation", async () => {
        const reservationDTO = ReservationMother.dto()
        const user = await UserMother.createManyUsers(services.userService, 1)
        const table = await TableMother.createManyTables(services.tableService, 1,reservationDTO.party_size)

        reservationDTO.user_id = user[0].user.id!
        reservationDTO.table_id = table[0].id!

        const response = await request(app.getHttpServer())
            .post('/reservation')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationDTO)
        
        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            id: expect.any(String),
            date: reservationDTO.date,
            party_size: reservationDTO.party_size,
            time_start: reservationDTO.time_start,
        })
    })

    it("Should not create a reservation if there are reservations that overlap it", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const user = await UserMother.createManyUsers(services.userService, 1)
        const reservationDTO = ReservationMother.dto({
            time_start: reservation.time_start,
            date: dayjs(reservation.date).format("YYYY-MM-DD"),
            table_id: reservation.table.id,
            user_id: reservation.user.id
        })


        reservationDTO.user_id = user[0].user.id!

        const response = await request(app.getHttpServer())
            .post('/reservation')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationDTO)
        expect(response.status).toBe(400)

    })

    it("Should not create a reservation on unavailables dates", async () => {
        const user = await UserMother.createManyUsers(services.userService, 1)
        const table = await TableMother.createManyTables(services.tableService, 1)
        const reservationDTO = ReservationMother.dto()

        reservationDTO.user_id = user[0].user.id!
        reservationDTO.table_id = table[0].id!
        reservationDTO.date = "2020-12-13" // restaurant doesn´t open on sundays


        const response = await request(app.getHttpServer())
            .post('/reservation')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationDTO)
        expect(response.status).toBe(400)

    })

    it("Should not create a reservation if the table capacity is not enough", async () => {
        const user = await UserMother.createManyUsers(services.userService, 1)
        const table = await TableMother.createManyTables(services.tableService, 1, 1)
        const reservationDTO = ReservationMother.dto()

        reservationDTO.user_id = user[0].user.id!
        reservationDTO.table_id = table[0].id!


        const response = await request(app.getHttpServer())
            .post('/reservation')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationDTO)
        expect(response.status).toBe(400)

    })

    it("Should not create a reservation if user have 3 reservartion on the selected date", async () => {
        const userDTO = UserMother.dto()
        const tableDTO = TableMother.dto()
        const reservationDTO = ReservationMother.dto({ date: "2020-12-11" })

        const responseUser = await services.userService.create(userDTO)
        const responseTable = await services.tableService.create(tableDTO)

        reservationDTO.user_id = responseUser?.user.id!
        reservationDTO.table_id = responseTable?.id!

        await services.reservationService.create({
            ...reservationDTO,
            time_start: "10:00:00"
        })
        await services.reservationService.create(reservationDTO)
        await services.reservationService.create({
            ...reservationDTO,
            time_start: "16:00:00"

        })

        const response = await request(app.getHttpServer())
            .post('/reservation')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send({
                ...reservationDTO,
                time_start: "19:00:00"
            })
        expect(response.status).toBe(400)

    })

    it("Should return a reservation", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);

        const response = await request(app.getHttpServer())
            .get(`/reservation/${reservation.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
        expect(response.status).toBe(200)

    })

    it("Should not return a reservation if the user is not the owner or an authorized employee", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const user = await UserMother.createManyUsers(services.userService, 1)

        const response = await request(app.getHttpServer())
            .get(`/reservation/${reservation.id}`)
            .set('Authorization', `Bearer ${user[0].token}`)
        expect(response.status).toBe(403)
    })

    it("Should cancel a reservation", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.CANCELLED
        }

        const response = await request(app.getHttpServer())
            .patch(`/reservation/${reservation.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationStatus)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe(reservationStatus.status)

    })

    it("Should set reservation status as no_show", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.NO_SHOW
        }

        const response = await request(app.getHttpServer())
            .patch(`/reservation/${reservation.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationStatus)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe(reservationStatus.status)
    })

    it("Should set reservation status as seated", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.SEATED
        }

        const response = await request(app.getHttpServer())
            .patch(`/reservation/${reservation.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationStatus)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe(reservationStatus.status)
    })

    it("Should set reservation status as finished", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.FINISHED
        }

        const response = await request(app.getHttpServer())
            .patch(`/reservation/${reservation.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(reservationStatus)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe(reservationStatus.status)
    })
})