import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { mockUserRepo } from "src/user/tests/mocks/user.mocks";
import { ReservationService } from "../reservation.service";
import { Reservation } from "../entities/reservation.entity";
import { mockReservationRepo, mockScheduleRepo, reservationId } from "./mocks/reservation.mock";
import { Schedule } from "../entities/schedule.entity";
import { mockDataSource, mockManager } from "src/common/tests/mocks/common.mocks";
import { ReservationMother } from "./reservationMother";
import { v4 as uuid } from "uuid"
import { mockTable } from "src/table/tests/mocks/tableMocks";
import { Table } from "src/table/entities/table.entity";


describe("Unit EmployeeServices tests", () => {
    let reservationService: ReservationService;
    let reservationRepository: Repository<Reservation>

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                ReservationService,
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
        reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation))

    })


    it('should create an employee', async () => {
        const reservationDTO = ReservationMother.dto()
        const reservationCreated = { ...reservationDTO, id: reservationId }

        const mockQueryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
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





})