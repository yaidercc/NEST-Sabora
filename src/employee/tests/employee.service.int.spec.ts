import { Test, TestingModule } from "@nestjs/testing"
import { Repository } from "typeorm";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeMother } from "./employeeMother";
import { JoiEnvValidation } from "src/config/joi.validation";
import { EnvConfiguration } from "src/config/env.config";
import { ConfigModule } from "@nestjs/config";
import { Employee } from "../entities/employee.entity";
import { EmployeeRole } from "../entities/employee_role.entity";
import { EmployeeModule } from "../employee.module";
import { EmployeeService } from "../employee.service";
import { User } from "src/user/entities/user.entity";
import { GeneralRole } from "src/user/entities/general_role.entity";
import { UserMother } from "src/user/tests/userMother";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { EmployeeRoles } from "src/common/enums/roles";


describe("Integrations test EmployeeService", () => {
    let employeeService: EmployeeService;
    let employeeRepository: Repository<Employee>
    let employeeRoleRepository: Repository<EmployeeRole>
    let module: TestingModule;
    let userService: UserService;
    let userRepository: Repository<User>
    let generalRoleRepository: Repository<GeneralRole>
    let employeeRoles;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: ".env.test",
                    load: [EnvConfiguration],
                    validationSchema: JoiEnvValidation
                }),
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: ":memory:",
                    entities: [Employee, EmployeeRole, User, GeneralRole],
                    synchronize: true,
                    dropSchema: true
                }),
                TypeOrmModule.forFeature([Employee, EmployeeRole]),
                EmployeeModule,
                UserModule
            ],
            providers: [UserService, EmployeeService]
        }).compile()

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        employeeService = module.get<EmployeeService>(EmployeeService);
        employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee))
        employeeRoleRepository = module.get<Repository<EmployeeRole>>(getRepositoryToken(EmployeeRole))
        generalRoleRepository = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))
        employeeRoles = await EmployeeMother.seedRoles(employeeRoleRepository)

        await UserMother.seedRoles(generalRoleRepository)

    })

    beforeEach(async () => {
        await employeeRepository.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create an employee", async () => {
        const userDTO = UserMother.dto();
        const responseUser = await userService.create(userDTO)

        const employeeDTO = EmployeeMother.dto({ user_id: responseUser?.user.id!, employee_role_id: employeeRoles[EmployeeRoles.cashier] })

        const responseEmployee = await employeeService.create(employeeDTO)

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
})

