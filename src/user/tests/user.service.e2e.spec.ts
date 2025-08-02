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

describe("Integrations test UserService", () => {
    let service: UserService;
    let repoUser: Repository<User>
    let repoGeneralRole: Repository<GeneralRole>
    let module: TestingModule;
    let app: INestApplication


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
                    entities: [User, GeneralRole],
                    synchronize: true,
                    dropSchema: true
                }),
                TypeOrmModule.forFeature([User, GeneralRole])
            ],
            providers: [UserService]
        }).compile()

        service = module.get<UserService>(UserService);
        repoUser = module.get<Repository<User>>(getRepositoryToken(User))
        repoGeneralRole = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))

        app = module.createNestApplication()
        await app.init()

        await UserMother.seedRoles(repoGeneralRole)
    })

    beforeEach(async () => {
        await repoUser.clear()
    })

    afterAll(async () => {
        await app.close()
    });

    it("Should create an user", async () => {
       
    })
})