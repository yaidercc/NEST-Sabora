import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "../user.service"
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";
import { GeneralRoles } from "../enums/generalRole";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "../user.module";
import { JoiEnvValidation } from "src/config/joi.validation";
import { EnvConfiguration } from "src/config/env.config";
import { ConfigModule } from "@nestjs/config";

describe("Integrations test UserService", () => {
    let service: UserService;
    let repoUser: Repository<User>
    let repoGeneralRole: Repository<GeneralRole>
    let module: TestingModule;


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
                    entities: [User, GeneralRole],
                    synchronize: true,
                    dropSchema: true
                }),
                TypeOrmModule.forFeature([User, GeneralRole]),
                UserModule
            ],
            providers: [UserService, JwtService]
        }).compile()

        service = module.get<UserService>(UserService);
        repoUser = module.get<Repository<User>>(getRepositoryToken(User))
        repoGeneralRole = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))
        await UserMother.seedRoles(repoGeneralRole)
    })

    beforeEach(async () => {
        await repoUser.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create an user", async () => {
        const userDTO = UserMother.dto();

        const response = await service.create(userDTO)

        const clientRole = await repoGeneralRole.findOneBy({ name: GeneralRoles.client })
        expect(response).toBeDefined()
        expect(response).toMatchObject({
            full_name: userDTO.full_name,
            email: userDTO.email,
            phone: userDTO.phone,
            role: clientRole
        })
    })

    it('should login an user', async () => {
        const userDTO = UserMother.dto();
        const userCreated = await service.create(userDTO)
        const {password, ...restuserInfo } = userCreated!

        const fakeToken = 'fake-jwt'

        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)
        const result = await service.login({ email: userDTO.email, password: userDTO.password });

        expect(result).toMatchObject(
            {
                user: restuserInfo,
                token: fakeToken
            }
        )
    });
})