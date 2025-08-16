import { DataSource, Repository } from "typeorm";
import { EmployeeService } from "../employee.service";
import { Employee } from "../entities/employee.entity";
import { EmployeeRole } from "../entities/employee_role.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { employeeId, mockDataSource, mockEmployeeRepo, mockEmployeeRoleRepo, mockManager } from "./mocks/employee.mock";
import { EmployeeMother } from "./employeeMother";
import { v4 as uuid } from "uuid"
import { User } from "src/user/entities/user.entity";
import { mockRoleRepo, mockUserRepo } from "src/user/tests/mocks/user.mocks";
import { GeneralRole } from "src/user/entities/general_role.entity";


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
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo
                },
                 {
                    provide: getRepositoryToken(GeneralRole),
                    useValue: mockRoleRepo
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
        mockManager.findOneBy.mockImplementation((entity, criteria) => {
            if (entity.name == "Employee") {
                return null
            }
            return this
        })

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
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
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


    it('should update an employee', async () => {
        const originalEmployee = { ...EmployeeMother.dto(), id: employeeId }
        const dtoUpdate = { hiring_date: "2022-10-12" }
        const updatedEmployee = { ...originalEmployee, ...dtoUpdate }


        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true }),
            getOne: jest.fn().mockResolvedValue(updatedEmployee)
        }

        mockEmployeeRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        mockEmployeeRepo.preload.mockReturnValue(updatedEmployee)
        mockEmployeeRepo.save.mockReturnValue(updatedEmployee)

        const response = await employeeService.update(employeeId, dtoUpdate)

        expect(mockEmployeeRepo.preload).toHaveBeenCalled()
        expect(mockEmployeeRepo.save).toHaveBeenCalled()
        expect(mockEmployeeRepo.createQueryBuilder).toHaveBeenCalled()
        expect(response).toMatchObject(updatedEmployee)


    });

    it('should delete an employee', async () => {
        const employee1Created = { ...EmployeeMother.dto(), id: employeeId }
        mockEmployeeRepo.findOneBy.mockReturnValue(employee1Created)
        await employeeService.remove(employee1Created.id)
        expect(mockEmployeeRepo.update).toHaveBeenCalled()

    });




})