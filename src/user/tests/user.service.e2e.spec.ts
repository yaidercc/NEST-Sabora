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
import { JwtService } from "@nestjs/jwt";
import { initialData } from "src/seed/data/seed-data";
import { SeedModule } from "src/seed/seed.module";
import { SeedService } from "src/seed/seed.service";
import { compareSync } from "bcrypt";
import { GeneralRoles } from "src/common/enums/roles";

describe("Integrations test UserService", () => {
    // setting up the necesaries variables
    let userService: UserService;
    let seedService: SeedService;
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
                UserModule,
                SeedModule
            ],
            providers: [UserService, JwtService, SeedService]
        }).compile()

        // Preparing the services en repositories to be used on the tests
        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        repoGeneralRole = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))
        seedService = module.get<SeedService>(SeedService)

        // Initializing the api
        app = module.createNestApplication()
        await app.init()
    })

    // Cleaning up the data before each tests
    beforeEach(async () => {
        await userRepository.clear()
        await seedService.executeSEED();
        const loginResponse = await request(app.getHttpServer())
            .post("/user/login")
            .send({ username: initialData.user.username, password: "Jhondoe123*" });

        adminLogin = loginResponse.body;
        clientRole = await repoGeneralRole.findOneBy({ name: GeneralRoles.client })
    })

    // Closing the nest aplication at the end of the tests
    afterAll(async () => {
        await app.close()
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    it("POST /user", async () => {
        const userDTO = UserMother.dto();
        const fakeToken = 'fake-jwt'
        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)

        const response = await request(app.getHttpServer())
            .post('/user')
            .send(userDTO)


        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            user: {
                full_name: userDTO.full_name,
                email: userDTO.email,
                phone: userDTO.phone,
                role: {
                    id: clientRole?.id,
                    name: clientRole?.name
                }
            },
            token: fakeToken
        })
    })

    it('POST /user/login', async () => {
        const userDTO = UserMother.dto();
        const fakeToken = 'fake-jwt'
        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)
        await userService.create(userDTO)

        const response = await request(app.getHttpServer())
            .post("/user/login")
            .send({ username: userDTO.username, password: userDTO.password })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(
            {
                user: {
                    full_name: userDTO.full_name,
                    email: userDTO.email,
                    phone: userDTO.phone,
                    role: {
                        id: clientRole?.id,
                        name: clientRole?.name
                    }
                },
                token: fakeToken
            }

        )
    });


    it("GET /user", async () => {
        await UserMother.createManyUsers(userService, 2);
        const response = await request(app.getHttpServer())
            .get("/user")
            .set('Authorization', `Bearer ${adminLogin?.token}`);
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(3)
    })


    it("GET /user/profile", async () => {
        await UserMother.createManyUsers(userService, 2);

        const response = await request(app.getHttpServer())
            .get("/user/profile")
            .set('Authorization', `Bearer ${adminLogin?.token}`);

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(adminLogin?.user!)
    })

    it("UPDATE /user", async () => {
        const [{ user, token }] = await UserMother.createManyUsers(userService, 1);
        const dtoUpdate = { full_name: "jhonsito doe" }
        const response = await request(app.getHttpServer())
            .patch(`/user/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(dtoUpdate)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(
            {
                full_name: dtoUpdate.full_name,
                email: user.email,
                phone: user.phone,
                role: {
                    id: clientRole?.id,
                    name: clientRole?.name
                },
            }
        )
    })



    it('POST /user/request-temp-password', async () => {
        const [{ user, token }] = await UserMother.createManyUsers(userService, 1)


        const userBeforeCange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: user.id })
            .getOne();

        await request(app.getHttpServer())
            .post("/user/request-temp-password")
            .send({
                email: user.email,
                username: user.username,
            })

        const userAfterChange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .addSelect("user.is_temporal_password")
            .where("user.id = :id", { id: user.id })
            .getOne();

        expect(userBeforeCange?.password).not.toBe(userAfterChange?.password)
        expect(userAfterChange?.is_temporal_password).toBe(true)
    });


    it('POST /user/change-password', async () => {
        const [{ user, token }] = await UserMother.createManyUsers(userService, 1);


        const userBeforeCange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: user.id })
            .getOne();

        await request(app.getHttpServer())
            .post("/user/change-password")
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: "Yaidercc123*",
                repeatPassword: "Yaidercc123*"
            })

        const userAfterChange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .addSelect("user.is_temporal_password")
            .where("user.id = :id", { id: user.id })
            .getOne();

        expect(userBeforeCange?.password).not.toBe(userAfterChange?.password)
        expect(userAfterChange?.is_temporal_password).toBe(false)
        expect(compareSync("Yaidercc123*", userAfterChange?.password!)).toBeTruthy()

    });


    it('DELETE /user', async () => {
        const [{ user }] = await UserMother.createManyUsers(userService, 1)
        await request(app.getHttpServer())
            .delete(`/user/${user.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        const userAfterChange = await userRepository
            .createQueryBuilder("user")
            .select("user.is_active")
            .where("user.id = :id", { id: user.id })
            .getRawOne()

        expect(userAfterChange.is_active).toBeFalsy()
    });

})