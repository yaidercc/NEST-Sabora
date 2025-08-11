import { SeedService } from "src/seed/seed.service";
import { EmployeeService } from "../employee.service";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { GeneralRole } from "src/user/entities/general_role.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { EnvConfiguration } from "src/config/env.config";
import { JoiEnvValidation } from "src/config/joi.validation";
import { Employee } from "../entities/employee.entity";
import { EmployeeRole } from "../entities/employee_role.entity";
import { UserModule } from "src/user/user.module";
import { SeedModule } from "src/seed/seed.module";
import { EmployeeModule } from "../employee.module";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as request from 'supertest';
import { EmployeeRoles, GeneralRoles } from "src/common/enums/roles";
import { initialData } from "src/seed/data/seed-data";
import { UserMother } from "src/user/tests/userMother";
import { EmployeeMother } from "./employeeMother";

describe("Integrations test EmployeeService", () => {
    let employeeService: EmployeeService;
    let seedService: SeedService;
    let userService: UserService;
    let userRepository: Repository<User>
    let repoGeneralRole: Repository<GeneralRole>
    let module: TestingModule;
    let app: INestApplication
    let clientRole: GeneralRole | null
    let adminLogin: {
        user: {
            id: string,
            full_name: string,
            email: string,
            phone: string,
            is_active: boolean,
            role: GeneralRole
        }, token: string
    } | undefined
    let employeeRepository: Repository<Employee>
    let employeeRoleRepository: Repository<EmployeeRole>
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
                    type: "postgres",
                    host: "localhost",
                    port: +process.env.DB_PORT!,
                    database: process.env.DB_NAME,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    entities: [User, GeneralRole, Employee, EmployeeRole],
                    synchronize: true,
                    dropSchema: true
                }),
                TypeOrmModule.forFeature([User, GeneralRole]),
                UserModule,
                SeedModule,
                EmployeeModule
            ],
            providers: [EmployeeService, JwtService, SeedService]
        }).compile()

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))

        employeeService = module.get<EmployeeService>(EmployeeService);
        employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee))

        employeeRoleRepository = module.get<Repository<EmployeeRole>>(getRepositoryToken(EmployeeRole))

        repoGeneralRole = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))

        seedService = module.get<SeedService>(SeedService)

        app = module.createNestApplication()
        await app.init()
    })

    beforeEach(async () => {
        await employeeRepository.clear()
        await seedService.executeSEED();

        const loginResponse = await request(app.getHttpServer())
            .post("/user/login")
            .send({ username: initialData.user.username, password: "Jhondoe123*" });

        adminLogin = loginResponse.body;
        clientRole = await repoGeneralRole.findOneBy({ name: GeneralRoles.client })
        employeeRoles = await EmployeeMother.seedRoles(employeeRoleRepository)
    })

    afterAll(async () => {
        await app.close()
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    it("POST /employee", async () => {
        const [{ user }] = await UserMother.createManyUsers(userService, 1)
        const employeeDTO = EmployeeMother.dto({ user_id: user.id, employee_role_id: employeeRoles[EmployeeRoles.cashier] })
        
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
})