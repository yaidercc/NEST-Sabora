import { TestingModule } from "@nestjs/testing";
import { EmployeeMother } from "./employeeMother";
import { UserMother } from "src/user/tests/userMother";
import { EmployeeRoles } from "src/common/enums/roles";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";


describe("Integrations test EmployeeService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;
    let employeeRoles;

    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();
        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
        employeeRoles = await EmployeeMother.seedRoles(repositories.employeeRoleRepository)
        await UserMother.seedRoles(repositories.generalRoleRepository)
    })

    beforeEach(async () => {
        await repositories.employeeRepository.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create an employee", async () => {
        const userDTO = UserMother.dto();
        const responseUser = await services.userService.create(userDTO)

        const employeeDTO = EmployeeMother.dto({ user_id: responseUser?.user.id!, employee_role_id: employeeRoles[EmployeeRoles.cashier] })

        const responseEmployee = await services.employeesService.create(employeeDTO)

        expect(responseEmployee?.id).toBeDefined()
        expect(responseEmployee?.hiring_date).toBe(employeeDTO.hiring_date)
        expect(responseEmployee?.user).toMatchObject({
            id: responseUser?.user.id,
            full_name: responseUser?.user.full_name,
            username: responseUser?.user.username,
            email: responseUser?.user.email,
            phone: responseUser?.user.phone,
        })
    })


    it("Should return an employee", async () => {
        const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)
        const response = await services.employeesService.findOne(employee.id)
        expect(response).toMatchObject({
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

    it("should return all employees", async () => {
        await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 2, employeeRoles)

        const response = await services.employeesService.findAll({ limit: 10, offset: 0 })

        expect(response).toBeDefined()
        expect(response.length).toBe(2)

    })

    it('should update an employee', async () => {
        const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)
        const dtoUpdate = { hiring_date: "2022-10-12" }

        const response = await services.employeesService.update(employee.id, dtoUpdate)

        expect(response?.hiring_date).toBe(dtoUpdate.hiring_date)


    });
})

