import { TestingModule } from "@nestjs/testing";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { MenuItemMother } from "./menuItemMother";


describe("Integrations test MenuItemService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;

    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();
        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    beforeEach(async () => {
        await repositories.menuItemRepository.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create a menu item", async () => {
        const menuItemDto = MenuItemMother.dto();
        const responseMenuItem = await services.menuItemService.create(menuItemDto)
        
        expect(responseMenuItem).toBeDefined()
        expect(responseMenuItem).toMatchObject({
            ...menuItemDto,
            name: menuItemDto.name.toLowerCase()
        })
       
    })


    // it("Should return an employee", async () => {
    //     const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)
    //     const response = await services.employeesService.findOne(employee.id)
    //     expect(response).toMatchObject({
    //         id: employee.id,
    //         hiring_date: employee.hiring_date,
    //         user: {
    //             id: employee.user.id
    //         },
    //         employee_role: {
    //             id: employee.employee_role.id
    //         }
    //     })
    // })

    // it("should return all employees", async () => {
    //     await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 2, employeeRoles)

    //     const response = await services.employeesService.findAll({ limit: 10, offset: 0 })

    //     expect(response).toBeDefined()
    //     expect(response.length).toBe(2)

    // })

    // it('should update an employee', async () => {
    //     const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)
    //     const dtoUpdate = { hiring_date: "2022-10-12" }

    //     const response = await services.employeesService.update(employee.id, dtoUpdate)

    //     expect(response?.hiring_date).toBe(dtoUpdate.hiring_date)


    // });

    // it('should delete an employee', async () => {
    //     const [employee] = await EmployeeMother.createManyEmployees(services.employeesService, services.userService, 1, employeeRoles)

    //     await services.employeesService.remove(employee.id)
    //     const response = await repositories.employeeRepository.createQueryBuilder("employee")
    //         .select("is_active")
    //         .where("employee.id=:id", {
    //             id: employee.id,
    //         })
    //         .getOne()

    //     expect(response?.is_active).toBeFalsy()

    // });

})

