import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "../user.service"
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";
import { GeneralRoles } from "../enums/roles";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "../user.module";
import { JoiEnvValidation } from "src/config/joi.validation";
import { EnvConfiguration } from "src/config/env.config";
import { ConfigModule } from "@nestjs/config";

describe("Integrations test UserService", () => {
    let userService: UserService;
    let userRepository: Repository<User>
    let generalRoleRepository: Repository<GeneralRole>
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

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        generalRoleRepository = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))
        await UserMother.seedRoles(generalRoleRepository)
    })

    beforeEach(async () => {
        await userRepository.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it.only("Should create an user", async () => {
        const userDTO = UserMother.dto();
        const fakeToken = 'fake-jwt'
        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)

        const response = await userService.create(userDTO)

        const clientRole = await generalRoleRepository.findOneBy({ name: GeneralRoles.client })
        expect(response).toBeDefined()
        expect(response).toMatchObject({
            user: {
                full_name: userDTO.full_name,
                email: userDTO.email,
                phone: userDTO.phone,
                role: clientRole
            },
            token: fakeToken

        })
    })

    it('should login an user', async () => {
        const userDTO = UserMother.dto();
        const fakeToken = 'fake-jwt'
        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)

        const userCreated = await userService.create(userDTO)


        const result = await userService.login({ email: userDTO.email, password: userDTO.password });

        expect(result).toMatchObject(userCreated!)
    });


    it('should return users created', async () => {
        await UserMother.createManyUsers(userService, 2);
        const response = await userService.findAll();

        expect(response.length).toBe(2)
    });
})