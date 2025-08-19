import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { mockUserRepo, mockUserService } from "src/user/tests/mocks/user.mocks";
import { ReservationService } from "../reservation.service";
import { Reservation } from "../entities/reservation.entity";
import { mockReservationRepo, mockScheduleRepo, reservationId } from "./mocks/reservation.mock";
import { Schedule } from "../entities/schedule.entity";
import { mockDataSource, mockManager } from "src/common/tests/mocks/common.mocks";
import { ReservationMother } from "./reservationMother";
import { v4 as uuid } from "uuid"
import { mockTable } from "src/table/tests/mocks/tableMocks";
import { Table } from "src/table/entities/table.entity";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { UserMother } from "src/user/tests/userMother";
import { UserService } from "src/user/user.service";
import { EmployeeRoles, GeneralRoles } from "src/common/enums/roles";
import { Status } from "../enum/status";
import { EmployeeMother } from "src/employee/tests/employeeMother";


describe("Unit ReservationServices tests", () => {
    let reservationService: ReservationService;
    let reservationRepository: Repository<Reservation>
    let module: TestingModule;
    let userService: UserService;
    const user = {
        id: uuid(),
        ...UserMother.dto(),
        is_active: true,
        is_temporal_password: false,
        role: {
            id: uuid(),
            name: GeneralRoles.CLIENT
        },

    } as unknown as User;

    const managerEmployee = {
        ...user,
        employee: {
            ...EmployeeMother.dto(),
            employee_role: {
                id: uuid(),
                name: EmployeeRoles.MANAGER
            }
        }
    } as unknown as User

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [],
            providers: [
                ReservationService,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo
                },
                {
                    provide: getRepositoryToken(Reservation),
                    useValue: mockReservationRepo
                },
                {
                    provide: getRepositoryToken(Schedule),
                    useValue: mockScheduleRepo
                },
                {
                    provide: getRepositoryToken(Table),
                    useValue: mockTable
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                },

            ]
        }).compile()

        reservationService = module.get<ReservationService>(ReservationService)
        userService = module.get<UserService>(UserService)
        reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation))

    })


    it('should create a reservation', async () => {
        const reservationDTO = ReservationMother.dto()
        const reservationCreated = { ...reservationDTO, id: reservationId }

        const mockQueryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockReturnValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        mockManager.create.mockReturnValue(reservationCreated)
        mockManager.save.mockReturnValue(reservationCreated)
        mockScheduleRepo.findOneBy.mockReturnValue(
            {
                id: uuid(),
                day_of_week: 6,
                opening_time: "08:00",
                closing_time: "20:00",
                is_closed: false,

            })

        const response = await reservationService.create(reservationDTO)

        expect(mockManager.create).toHaveBeenCalled()
        expect(mockManager.save).toHaveBeenCalled()
        expect(mockReservationRepo.createQueryBuilder).toHaveBeenCalled()
        expect(response).toMatchObject(reservationCreated)

    });


    it("Should not create a reservation if there are reservations that overlap it", async () => {
        const reservationDTO = ReservationMother.dto()
        const reservationCreated = { ...reservationDTO, id: reservationId }

        const mockQueryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockReturnValue([{ ...reservationDTO, id: uuid() }]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        mockManager.create.mockReturnValue(reservationCreated)
        mockManager.save.mockReturnValue(reservationCreated)
        mockScheduleRepo.findOneBy.mockReturnValue(
            {
                id: uuid(),
                day_of_week: 6,
                opening_time: "08:00",
                closing_time: "20:00",
                is_closed: false,

            })

        await expect(
            reservationService.create(reservationDTO)
        ).rejects.toThrow(BadRequestException);

    })



    it("Should not create a reservation on unavailables dates", async () => {
        const reservationDTO = ReservationMother.dto({ date: "2020-12-13" })
        const reservationCreated = { ...reservationDTO, id: reservationId }

        const mockQueryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockReturnValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        mockManager.create.mockReturnValue(reservationCreated)
        mockManager.save.mockReturnValue(reservationCreated)
        mockScheduleRepo.findOneBy.mockReturnValue(null)

        await expect(
            reservationService.create(reservationDTO)
        ).rejects.toThrow(BadRequestException);

    })

    it("Should not create a reservation if the table capacity is not enough", async () => {
        const reservationDTO = ReservationMother.dto()
        const reservationCreated = { ...reservationDTO, id: reservationId }

        const mockQueryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockReturnValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        mockManager.create.mockReturnValue(reservationCreated)
        mockManager.save.mockReturnValue(reservationCreated)
        mockScheduleRepo.findOneBy.mockResolvedValue(
            {
                id: uuid(),
                day_of_week: 6,
                opening_time: "08:00",
                closing_time: "20:00",
                is_closed: false,

            })
        mockTable.findOne.mockResolvedValue({ capacity: 1 })

        await expect(
            reservationService.create(reservationDTO)
        ).rejects.toThrow(BadRequestException);



    })

    it("Should not create a reservation if user have 3 reservartion on the selected date", async () => {
        const reservationDTO = ReservationMother.dto()
        const reservationCreated = { ...reservationDTO, id: reservationId }

        const mockQueryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockResolvedValue(3),
            getMany: jest.fn().mockResolvedValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        mockManager.create.mockResolvedValue(reservationCreated)
        mockManager.save.mockResolvedValue(reservationCreated)
        mockScheduleRepo.findOneBy.mockResolvedValue(
            {
                id: uuid(),
                day_of_week: 6,
                opening_time: "08:00",
                closing_time: "20:00",
                is_closed: false,

            })

        await expect(
            reservationService.create(reservationDTO)
        ).rejects.toThrow(BadRequestException);

    })

    it("Should return a reservation", async () => {
        const reservationCreated = { ...ReservationMother.dto(), id: reservationId }

        mockReservationRepo.findOneBy.mockResolvedValue({ ...reservationCreated, user })

        const response = await reservationService.findOne(reservationCreated.id, user);

        expect(response).toBeDefined()
        expect(response).toMatchObject({ ...reservationCreated, user })
    })

    it("Should not return a reservation if the user is not the owner or an authorized employee", async () => {
        const reservationCreated = { ...ReservationMother.dto(), id: reservationId }
        mockReservationRepo.findOneBy.mockResolvedValue({ ...reservationCreated, user })

        await expect(
            reservationService.findOne(reservationCreated.id, { ...user, id: uuid() } as User)
        ).rejects.toThrow(ForbiddenException);
    })

    it("Should cancel a reservation", async () => {
        const reservationCreated = { ...ReservationMother.dto(), id: reservationId }
        const reservationStatus = {
            status: Status.CANCELLED
        }
        const mockQueryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ ...reservationCreated, user }),
            getMany: jest.fn().mockResolvedValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        const response = await reservationService.changeReservationStatus(reservationCreated.id, reservationStatus, user)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })

    it("Should set reservation status as no_show", async () => {
        const reservationCreated = { ...ReservationMother.dto(), id: reservationId }
        const reservationStatus = {
            status: Status.NO_SHOW
        }


        const mockQueryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ ...reservationCreated, managerEmployee }),
            getMany: jest.fn().mockResolvedValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        const response = await reservationService.changeReservationStatus(reservationCreated.id, reservationStatus, managerEmployee)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })

    it("Should set reservation status as seated", async () => {
        const reservationCreated = { ...ReservationMother.dto(), id: reservationId }
        const reservationStatus = {
            status: Status.SEATED
        }
        const mockQueryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ ...reservationCreated, managerEmployee }),
            getMany: jest.fn().mockResolvedValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        const response = await reservationService.changeReservationStatus(reservationCreated.id, reservationStatus, managerEmployee)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })
    it("Should set reservation status as finished", async () => {
        const reservationCreated = { ...ReservationMother.dto(), id: reservationId }
        const reservationStatus = {
            status: Status.FINISHED
        }
        const mockQueryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ ...reservationCreated, managerEmployee }),
            getMany: jest.fn().mockResolvedValue([]),
        }
        mockReservationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        const response = await reservationService.changeReservationStatus(reservationCreated.id, reservationStatus, managerEmployee)

        expect(response).toBeDefined()
        expect(response?.status).toBe(reservationStatus.status)
    })





})