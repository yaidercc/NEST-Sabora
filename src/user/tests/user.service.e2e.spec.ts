import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "../user.service"
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";
import { ConfigModule } from "@nestjs/config";
import { EnvConfiguration } from "src/config/env.config";
import { JoiEnvValidation } from "src/config/joi.validation";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { UserModule } from "../user.module";
import { GeneralRoles } from "../enums/generalRole";
import { JwtService } from "@nestjs/jwt";

describe("Integrations test UserService", () => {
    // setting up the necesaries variables
    let service: UserService;
    let repoUser: Repository<User>
    let repoGeneralRole: Repository<GeneralRole>
    let module: TestingModule;
    let app: INestApplication
    let clientRole: GeneralRole | null


    beforeAll(async () => {
        // Creating a module for the tests
        module = await Test.createTestingModule({
            imports: [
                // Importing the configs for the environment variables
                ConfigModule.forRoot({
                    envFilePath: ".env.test", // we´ll use the variables from the .env.test file
                    load: [EnvConfiguration],
                    validationSchema: JoiEnvValidation
                }),
                // Setting up the config for the database and the schemas
                TypeOrmModule.forRoot({
                    type: "postgres",
                    host: "localhost",
                    port: +process.env.DB_PORT!,
                    database: process.env.DB_NAME,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    entities: [User, GeneralRole],
                    synchronize: true,
                    dropSchema: true
                }),
                TypeOrmModule.forFeature([User, GeneralRole]),
                UserModule
            ],
            providers: [UserService, JwtService]
        }).compile()

        // Preparing the services en repositories to be used on the tests
        service = module.get<UserService>(UserService);
        repoUser = module.get<Repository<User>>(getRepositoryToken(User))
        repoGeneralRole = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))

        // Initializing the api
        app = module.createNestApplication()
        await app.init()

        // Executing the seeders for the general roles
        await UserMother.seedRoles(repoGeneralRole)

        clientRole = await repoGeneralRole.findOneBy({ name: GeneralRoles.client })
    })

    // Cleaning up the data before each tests
    beforeEach(async () => {
        await repoUser.clear()
    })

    // Closing the nest aplication at the end of the tests
    afterAll(async () => {
        await app.close()
    });

    it("POST /user", async () => {
        const userDTO = UserMother.dto();

        const response = await request(app.getHttpServer())
            .post('/user')
            .send(userDTO)


        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            full_name: userDTO.full_name,
            email: userDTO.email,
            phone: userDTO.phone,
            role: {
                id: clientRole?.id,
                name: clientRole?.name
            }
        })
    })

    it('POST /user/login', async () => {
        const userDTO = UserMother.dto();
        const userCreated = await service.create(userDTO)
        const { password, ...restuserInfo } = userCreated!

        const fakeToken = 'fake-jwt'

        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)
        const response = await request(app.getHttpServer())
            .post("/user/login")
            .send({ email: userDTO.email, password: userDTO.password })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(
            {
                user: {
                    ...restuserInfo,
                    role: {
                        id: clientRole?.id,
                        name: clientRole?.name
                    }
                },
                token: fakeToken
            }
        )
    });
})