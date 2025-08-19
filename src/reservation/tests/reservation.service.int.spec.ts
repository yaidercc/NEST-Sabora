import { TestingModule } from "@nestjs/testing";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { TableMother } from "src/table/tests/tableMother";
import { UserMother } from "src/user/tests/userMother";
import { ReservationMother } from "./reservationMother";
import { Status } from "../enum/status";
import { initialData } from "src/seed/data/seed-data";
import * as dayjs from "dayjs"
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";


describe("Integrations test ReservationService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;
    let manager;

    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();
        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
        manager = await repositories.userRepository.createQueryBuilder("user")
            .leftJoinAndSelect("user.employee", "employee")
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("employee.employee_role", "employee_role")
            .where("user.username=:username", { username: initialData.user.pop()?.username! }).getOne()

    })

    beforeEach(async () => {
        await TestHelpers.setupTestData(services.seedService)
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create a reservation", async () => {
        const userDTO = UserMother.dto()
        const tableDTO = TableMother.dto()
        const reservationDTO = ReservationMother.dto()

        const responseUser = await services.userService.create(userDTO)
        const responseTable = await services.tableService.create(tableDTO)

        reservationDTO.user_id = responseUser?.user.id!
        reservationDTO.table_id = responseTable?.id!

        const response = await services.reservationService.create(reservationDTO)

        expect(response).toBeDefined()
        expect(response).toMatchObject({
            id: expect.any(String),
            date: reservationDTO.date,
            party_size: reservationDTO.party_size,
            time_start: reservationDTO.time_start,
        })
    })

    it("Should not create a reservation if there are reservations that overlap it", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const userDTO = UserMother.dto()
        const reservationDTO = ReservationMother.dto({
            time_start: reservation.time_start,
            date: dayjs(reservation.date).format("YYYY-MM-DD"),
            table_id: reservation.table.id,
            user_id: reservation.user.id
        })

        const responseUser = await services.userService.create(userDTO)

        reservationDTO.user_id = responseUser?.user.id!

        await expect(
            services.reservationService.create(reservationDTO)
        ).rejects.toThrow(BadRequestException);

    })

    it("Should not create a reservation on unavailables dates", async () => {
        const userDTO = UserMother.dto()
        const tableDTO = TableMother.dto()
        const reservationDTO = ReservationMother.dto()

        const responseUser = await services.userService.create(userDTO)
        const responseTable = await services.tableService.create(tableDTO)

        reservationDTO.user_id = responseUser?.user.id!
        reservationDTO.table_id = responseTable?.id!
        reservationDTO.date = "2020-12-13" // restaurant doesn´t open on sunday


        await expect(
            services.reservationService.create(reservationDTO)
        ).rejects.toThrow(BadRequestException);

    })

    it("Should not create a reservation if the table capacity is not enough", async () => {
        const userDTO = UserMother.dto()
        const tableDTO = TableMother.dto({ capacity: 1 })
        const reservationDTO = ReservationMother.dto()

        const responseUser = await services.userService.create(userDTO)
        const responseTable = await services.tableService.create(tableDTO)

        reservationDTO.user_id = responseUser?.user.id!
        reservationDTO.table_id = responseTable?.id!


        await expect(
            services.reservationService.create(reservationDTO)
        ).rejects.toThrow(BadRequestException);

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

        await expect(
            services.reservationService.create({
                ...reservationDTO,
                time_start: "19:00:00"
            })
        ).rejects.toThrow(BadRequestException);

    })

    it("Should return a reservation", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const response = await services.reservationService.findOne(reservation.id, reservation.user);

        expect(response).toBeDefined()
        expect(response).toMatchObject(reservation)
    })

    it("Should not return a reservation if the user is not the owner or an authorized employee", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const user = await UserMother.createManyUsers(services.userService, 1)

        await expect(
            services.reservationService.findOne(reservation.id, user[0].user as User)
        ).rejects.toThrow(ForbiddenException);
    })

    it("Should cancel a reservation", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.CANCELLED
        }
        const response = await services.reservationService.changeReservationStatus(reservation.id, reservationStatus, reservation.user)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })

    it("Should set reservation status as no_show", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.NO_SHOW
        }

        const response = await services.reservationService.changeReservationStatus(reservation.id, reservationStatus, manager!)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })

    it("Should set reservation status as seated", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.SEATED
        }

        const response = await services.reservationService.changeReservationStatus(reservation.id, reservationStatus, manager!)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })
    it("Should set reservation status as finished", async () => {
        const [reservation] = await ReservationMother.createManyReservations(services.reservationService, services.userService, services.tableService, 1);
        const reservationStatus = {
            status: Status.FINISHED
        }

        const response = await services.reservationService.changeReservationStatus(reservation.id, reservationStatus, manager!)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })






})

