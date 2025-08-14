import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TableService } from "../table.service";
import { Table } from "../entities/table.entity";
import { TableMother } from "./tableMother";
import { mockTable, tableId } from "./mocks/tableMocks";

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



})