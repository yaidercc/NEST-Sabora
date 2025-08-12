import { DataSource, Repository } from "typeorm";
import { EmployeeService } from "../employee.service";
import { Employee } from "../entities/employee.entity";
import { EmployeeRole } from "../entities/employee_role.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { employeeId, mockDataSource, mockEmployeeRepo, mockEmployeeRoleRepo, mockManager } from "./mocks/employee.mock";
import { EmployeeMother } from "./employeeMother";
import { v4 as uuid } from "uuid"


describe("Unit EmployeeServices tests", () => {
    let employeeService: EmployeeService;
    let employeeRepository: Repository<Employee>
    let employeeRoleRepository: Repository<EmployeeRole>

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                EmployeeService,
                {
                    provide: getRepositoryToken(Employee),
                    useValue: mockEmployeeRepo
                },
                {
                    provide: getRepositoryToken(EmployeeRole),
                    useValue: mockEmployeeRoleRepo
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                },

            ]
        }).compile()

        employeeService = module.get<EmployeeService>(EmployeeService)
        employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee))
        employeeRoleRepository = module.get<Repository<EmployeeRole>>(getRepositoryToken(EmployeeRole))

    })


    it('should create an employee', async () => {
        const employeeDTO = EmployeeMother.dto()
        const employeeCreated = { ...employeeDTO, id: employeeId }

        mockManager.create.mockReturnValue(employeeCreated)
        mockManager.save.mockReturnValue(employeeCreated)

        const response = await employeeService.create(employeeDTO)

        expect(mockManager.create).toHaveBeenCalled()
        expect(mockManager.save).toHaveBeenCalled()
        expect(response).toMatchObject(employeeCreated)

    });



    it('should return an employee', async () => {
        const employeeDTO = EmployeeMother.dto()
        const employeeCreated = { ...employeeDTO, id: employeeId }

        const mockQueryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(employeeCreated)
        }

        mockEmployeeRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        const response = await employeeService.findOne(employeeCreated.id)
        expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2)
        expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1)
        expect(response).toMatchObject(employeeCreated)

    });

    it('should return all employee', async () => {
        const employee1Created = { ...EmployeeMother.dto(), id: employeeId }
        const employee2Created = { ...EmployeeMother.dto({ user_id: uuid(), employee_role_id: uuid() }), id: employeeId }

        mockEmployeeRepo.find.mockReturnValue([
            employee1Created,
            employee2Created
        ])

        const response = await employeeService.findAll({ limit: 10, offset: 0 })

        expect(mockEmployeeRepo.find).toHaveBeenCalled()
        expect(response).toEqual([
            employee1Created,
            employee2Created
        ])

    });



})