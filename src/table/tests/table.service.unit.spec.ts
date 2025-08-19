import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TableService } from "../table.service";
import { Table } from "../entities/table.entity";
import { TableMother } from "./tableMother";
import { mockTable, tableId } from "./mocks/tableMocks";
import { v4 as uuid } from "uuid"

describe("Unit UserServices tests", () => {
    let tableService: TableService;
    let tableRepository: Repository<Table>

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                TableService,
                {
                    provide: getRepositoryToken(Table),
                    useValue: mockTable
                }
            ]
        }).compile()

        tableService = module.get<TableService>(TableService)
        tableRepository = module.get<Repository<Table>>(getRepositoryToken(Table))

    })


    it('should create a table', async () => {
        const tableDTO = TableMother.dto()
        const table = { id: tableId, ...tableDTO }

        mockTable.create.mockReturnValue(table)
        mockTable.save.mockReturnValue(table)

        const response = await tableService.create(tableDTO);

        expect(mockTable.create).toHaveBeenCalled()
        expect(mockTable.save).toHaveBeenCalled()
        expect(response).toMatchObject(tableDTO);
    });


    it('should return all tables', async () => {
        const table1 = { id: tableId, ...TableMother.dto() }
        const table2 = { ...TableMother.dto(), id: uuid(), name: "Table 999" }

        mockTable.find.mockReturnValue([
            table1,
            table2
        ])

        const response = await tableService.findAll({ limit: 10, offset: 0 });

        expect(mockTable.find).toHaveBeenCalled()
        expect(response).toEqual([table1, table2]);
    });

    it('should return a table', async () => {
        const tableDTO = { id: tableId, ...TableMother.dto() }

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockTable.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        mockTable.findOneBy.mockReturnValue(tableDTO)


        const response = await tableService.findOne(tableId);

        expect(mockTable.createQueryBuilder).toHaveBeenCalled()
        expect(mockTable.findOneBy).toHaveBeenCalled()
        expect(response).toEqual(tableDTO);
    });

    it('should return tables by capacity', async () => {
        const table1 = { id: tableId, ...TableMother.dto(), capacity: 4 }
        const table2 = { ...TableMother.dto(), id: uuid(), name: "Table 998", capacity: 5 }
        const table3 = { ...TableMother.dto(), id: uuid(), name: "Table 999", capacity: 2 }

        mockTable.find.mockReturnValue([
            table1,
            table2
        ])

        const response = await tableService.findTablesByCapacity({ limit: 10, offset: 0 }, { capacity: 4 });

        expect(mockTable.find).toHaveBeenCalled()
        expect(response).toEqual([table1, table2]);
    });

    it('should update a table', async () => {
        const tableDTO = { id: tableId, ...TableMother.dto() }
        const dtoUpdate = { capacity: 5 }
        const updatedUser = { ...tableDTO, ...dtoUpdate }

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockTable.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        mockTable.preload.mockReturnValue(updatedUser)

        const response = await tableService.update(tableId, dtoUpdate);

        expect(mockTable.createQueryBuilder).toHaveBeenCalled()
        expect(mockTable.preload).toHaveBeenCalled()
        expect(response).toEqual(updatedUser);
    });

    it('should remove a table', async () => {

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockTable.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        const response = await tableService.remove(tableId);

        expect(mockTable.createQueryBuilder).toHaveBeenCalled()
        expect(mockTable.update).toHaveBeenCalledWith(tableId, { is_active: false })
    });



})