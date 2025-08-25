import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { menuItemId, mockMenuItemRepo } from "./mocks/menuItem.mock";
import { EmployeeMother } from "./employeeMother";
import { v4 as uuid } from "uuid"
import { User } from "src/user/entities/user.entity";
import { mockRoleRepo, mockUserRepo } from "src/user/tests/mocks/user.mocks";
import { GeneralRole } from "src/user/entities/general_role.entity";
import { mockDataSource, mockManager } from "src/common/tests/mocks/common.mocks";
import { MenuItem } from "../entities/menu_item.entity";
import { MenuItemService } from "../menu_item.service";


describe("Unit EmployeeServices tests", () => {
    let menuItemService: MenuItemService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                MenuItemService,
                {
                    provide: getRepositoryToken(MenuItem),
                    useValue: mockMenuItemRepo
                }
            ]
        }).compile()

        menuItemService = module.get<MenuItemService>(MenuItemService)

    })


    it('should create an employee', async () => {
        const employeeDTO = EmployeeMother.dto()
        const employeeCreated = { ...employeeDTO, id: menuItemId }

        mockMenuItemRepo.create.mockResolvedValue()

        const response = await menuItemService.create(employeeDTO)

        expect(mockManager.create).toHaveBeenCalled()
        expect(mockManager.save).toHaveBeenCalled()
        expect(response).toMatchObject(employeeCreated)

    });


    // it('should return an employee', async () => {
    //     const employeeDTO = EmployeeMother.dto()
    //     const employeeCreated = { ...employeeDTO, id: employeeId }

    //     const mockQueryBuilder = {
    //         leftJoinAndSelect: jest.fn().mockReturnThis(),
    //         select: jest.fn().mockReturnThis(),
    //         where: jest.fn().mockReturnThis(),
    //         andWhere: jest.fn().mockReturnThis(),
    //         getOne: jest.fn().mockResolvedValue(employeeCreated)
    //     }

    //     mockEmployeeRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

    //     const response = await employeeService.findOne(employeeCreated.id)
    //     expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2)
    //     expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1)
    //     expect(response).toMatchObject(employeeCreated)

    // });

    // it('should return all employee', async () => {
    //     const employee1Created = { ...EmployeeMother.dto(), id: employeeId }
    //     const employee2Created = { ...EmployeeMother.dto({ user_id: uuid(), employee_role_id: uuid() }), id: employeeId }


    //     mockEmployeeRepo.find.mockReturnValue([
    //         employee1Created,
    //         employee2Created
    //     ])

    //     const response = await employeeService.findAll({ limit: 10, offset: 0 })

    //     expect(mockEmployeeRepo.find).toHaveBeenCalled()
    //     expect(response).toEqual([
    //         employee1Created,
    //         employee2Created
    //     ])

    // });


    // it('should update an employee', async () => {
    //     const originalEmployee = { ...EmployeeMother.dto(), id: employeeId }
    //     const dtoUpdate = { hiring_date: "2022-10-12" }
    //     const updatedEmployee = { ...originalEmployee, ...dtoUpdate }


    //     const mockQueryBuilder = {
    //         select: jest.fn().mockReturnThis(),
    //         where: jest.fn().mockReturnThis(),
    //         andWhere: jest.fn().mockReturnThis(),
    //         leftJoinAndSelect: jest.fn().mockReturnThis(),
    //         getRawOne: jest.fn().mockResolvedValue({ is_active: true }),
    //         getOne: jest.fn().mockResolvedValue(updatedEmployee)
    //     }

    //     mockEmployeeRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

    //     mockEmployeeRepo.preload.mockReturnValue(updatedEmployee)
    //     mockEmployeeRepo.save.mockReturnValue(updatedEmployee)

    //     const response = await employeeService.update(employeeId, dtoUpdate)

    //     expect(mockEmployeeRepo.preload).toHaveBeenCalled()
    //     expect(mockEmployeeRepo.save).toHaveBeenCalled()
    //     expect(mockEmployeeRepo.createQueryBuilder).toHaveBeenCalled()
    //     expect(response).toMatchObject(updatedEmployee)


    // });

    // it('should delete an employee', async () => {
    //     const employee1Created = { ...EmployeeMother.dto(), id: employeeId }
    //     mockEmployeeRepo.findOneBy.mockReturnValue(employee1Created)
    //     await employeeService.remove(employee1Created.id)
    //     expect(mockEmployeeRepo.update).toHaveBeenCalled()

    // });




})