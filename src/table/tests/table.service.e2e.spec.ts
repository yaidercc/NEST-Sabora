import { TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { TestDatabaseManager } from "src/common/tests/test-database";
import { AdminLogin, TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { TableMother } from "./tableMother";

describe("Integrations test TablesService", () => {
    let module: TestingModule;
    let app: INestApplication
    let adminLogin: AdminLogin | undefined
    let services: TestServices
    let repositories: TestRepositories
    beforeAll(async () => {
        // Initializing module and Nest app
        const testDB = await TestDatabaseManager.initializeE2E()
        app = testDB.app
        module = testDB.module

        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    // Cleaning up the data before each test
    beforeEach(async () => {
        await services.seedService.executeSEED();
        adminLogin = await TestHelpers.loginAsAdmin(app);
    })

    // Closing the nest aplication at the end of the tests
    afterAll(async () => {
        await TestDatabaseManager.cleanUp();
    });

    it("POST /table", async () => {
        const tableDTO = TableMother.dto();

        const response = await request(app.getHttpServer())
            .post('/table')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(tableDTO)

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject(
            tableDTO
        )
    })

    it("GET /table/term", async () => {
        const [{ is_active: _, ...table }] = await TableMother.createManyTables(services.tableService, 1)

        const response = await request(app.getHttpServer())
        .get(`/table/${table.id}`)
        .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(
            table
        )
    })


    it("GET /table", async () => {
        await TableMother.createManyTables(services.tableService, 2)

        const response = await request(app.getHttpServer())
        .get(`/table/?limit=${10}&offset=${0}`)
        .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(7)
    })


    it("PATCH /table", async () => {
        const [table] = await TableMother.createManyTables(services.tableService, 1)
        const updateDTO = { capacity: "12" }
        const response = await request(app.getHttpServer())
            .patch(`/table/${table.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(updateDTO)

        expect(response.status).toBe(200)
        expect(response.body.capacity).toBe(updateDTO.capacity)

    })



    it("DELETE /table", async () => {
        const [table] = await TableMother.createManyTables(services.tableService, 1)

        const response = await request(app.getHttpServer())
            .delete(`/table/${table.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        const tableAfterBeingEliminated = await repositories.employeeRepository
            .createQueryBuilder("employee")
            .addSelect("employee.is_active")
            .where("employee.id = :id", { id: table.id })
            .getOne();

        expect(response.status).toBe(200)
        expect(tableAfterBeingEliminated?.is_active).toBeFalsy()

    })


})