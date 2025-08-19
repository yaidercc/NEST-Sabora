import { TestingModule } from "@nestjs/testing";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { TableMother } from "./tableMother";

describe("Integrations test UserService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;

    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();

        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    beforeEach(async () => {
        await repositories.tableRepository.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create a table", async () => {
        const tableDTO = TableMother.dto();
        const response = await services.tableService.create(tableDTO)

        expect(response).toBeDefined()
        expect(response).toMatchObject(tableDTO)
    })


    it("Should get a table", async () => {
        const [{ is_active: _, ...table }] = await TableMother.createManyTables(services.tableService, 1);
        const response = await services.tableService.findOne(table.id)

        expect(response).toBeDefined()
        expect(response).toMatchObject(table)
    })

    it("Should return all tables", async () => {
        const [table1, table2] = await TableMother.createManyTables(services.tableService, 2);
        const response = await services.tableService.findAll({ limit: 10, offset: 0 })

        expect(response).toBeDefined()
        expect(response).toHaveLength(2)
        expect(response).toEqual([
            { ...table1, is_active: undefined },
            { ...table2, is_active: undefined }
        ])
    })

    it("Should return all tables by capacity", async () => {
        const [table1] = await TableMother.createManyTables(services.tableService, 1, 5);
        const [table2] = await TableMother.createManyTables(services.tableService, 1, 4);
        const [table3] = await TableMother.createManyTables(services.tableService, 1, 1);

        const response = await services.tableService.findTablesByCapacity({ limit: 10, offset: 0 }, { capacity: 3 })

        expect(response).toBeDefined()
        expect(response).toHaveLength(2)
        expect(response).toEqual([
            { ...table1, is_active: undefined },
            { ...table2, is_active: undefined }
        ])
    })


    it("Should update a table", async () => {
        const [{ is_active: _, ...table }] = await TableMother.createManyTables(services.tableService, 1);
        const dtoUpdate = { capacity: 1 }

        const response = await services.tableService.update(table.id, dtoUpdate)

        expect(response).toBeDefined()
        expect(response).toMatchObject({ ...table, ...dtoUpdate })
    })

    it("Should remove a table", async () => {
        const [{ is_active: _, ...table }] = await TableMother.createManyTables(services.tableService, 1);

        await services.tableService.remove(table.id);

        const tableAfterBeingEliminated = await repositories.tableRepository
            .createQueryBuilder("table")
            .select("table.is_active ")
            .where("table.id = :id", { id: table.id })
            .getOne();
        expect(tableAfterBeingEliminated?.is_active).toBeFalsy()
    });

})