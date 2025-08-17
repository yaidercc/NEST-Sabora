import { GeneralRole } from "src/user/entities/general_role.entity";
import { TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { EmployeeRoles, GeneralRoles } from "src/common/enums/roles";
import { UserMother } from "src/user/tests/userMother";
import { EmployeeMother } from "./employeeMother";
import { AdminLogin, TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { TestDatabaseManager } from "src/common/tests/test-database";

describe("Integrations test EmployeeService", () => {
    let module: TestingModule;
    let app: INestApplication
    let clientRole: GeneralRole | null
    let adminLogin: AdminLogin | undefined
    let services: TestServices
    let repositories: TestRepositories
    let employeeRoles;

    beforeAll(async () => {
        const testDB = await TestDatabaseManager.initializeE2E()
        app = testDB.app
        module = testDB.module

        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    beforeEach(async () => {
        await services.seedService.executeSEED();
        adminLogin = await TestHelpers.loginAsAdmin(app);
        clientRole = await repositories.generalRoleRepository.findOneBy({ name: GeneralRoles.CLIENT })
        employeeRoles = await EmployeeMother.seedRoles(repositories.employeeRoleRepository)
    })

    afterAll(async () => {
        await TestDatabaseManager.cleanUp();
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    it("POST /employee", async () => {
        const [{ user }] = await UserMother.createManyUsers(services.userService, 1)
        const employeeDTO = EmployeeMother.dto({ user_id: user.id, employee_role_id: employeeRoles[EmployeeRoles.CASHIER] })

        const response = await request(app.getHttpServer())
            .post('/employee')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(employeeDTO)

        expect(response.status).toBe(201)
        expect(response.body.id).toBeDefined()
        expect(response.body.hiring_date).toBe(employeeDTO.hiring_date)
        expect(response.body.user).toMatchObject({
            id: user.id,
            full_name: user.full_name,
            username: user.username,
            email: user.email,
            phone: user.phone,
        })
    })

    it("GET /employee/:term", async () => {
        const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)

        const response = await request(app.getHttpServer())
            .get(`/employee/${employee.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body).toMatchObject({
            id: employee.id,
            hiring_date: employee.hiring_date,
            user: {
                id: employee.user.id
            },
            employee_role: {
                id: employee.employee_role.id
            }
        })

    })

    it("GET /employee", async () => {
        await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 2, employeeRoles)

        const response = await request(app.getHttpServer())
            .get(`/employee/?limit=${10}&offset=${0}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.length).toBe(2)

    })

    it('PATCH /employee', async () => {
        const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)
        const dtoUpdate = { hiring_date: "2022-10-12" }

        const response = await request(app.getHttpServer())
            .patch(`/employee/${employee.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(dtoUpdate)
        expect(response.status).toBe(200)
        expect(response.body.hiring_date).toBe(dtoUpdate.hiring_date)

    });


    it('DELETE /employee', async () => {
        const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)


        const response = await request(app.getHttpServer())
            .delete(`/employee/${employee.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        
        const employeeAfterChange = await repositories.employeeRepository
            .createQueryBuilder("employee")
            .addSelect("employee.is_active")
            .where("employee.id = :id", { id: employee.id })
            .getOne();

        expect(response.status).toBe(200)
        expect(employee?.is_active).toBeTruthy()
        expect(employeeAfterChange?.is_active).toBeFalsy()

    });
})