import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "../user.service"
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "../user.module";
import { JoiEnvValidation } from "src/config/joi.validation";
import { EnvConfiguration } from "src/config/env.config";
import { ConfigModule } from "@nestjs/config";
import { compareSync } from "bcrypt";
import { GeneralRoles } from "src/common/enums/roles";


jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([{ statusCode: 202 }]), // It simulates that the mail had sended successfuly
}));

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

    it("Should create an user", async () => {
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

        const response = await userService.login({ username: userDTO.username, password: userDTO.password });

        expect(response).toMatchObject({
            user: {
                full_name: userDTO.full_name,
                username: userDTO.username,
                email: userDTO.email,
                phone: userDTO.phone,

            },
            token: fakeToken
        })
    });


    it('should return users created', async () => {
        await UserMother.createManyUsers(userService, 2);
        const response = await userService.findAll();

        expect(response.length).toBe(2)
    });

    it('should update an user', async () => {
        const userDTO = UserMother.dto();
        const dtoUpdate = { full_name: "jhonsito doe" }

        const userCreated = await userService.create(userDTO)

        const response = await userService.update(userCreated?.user.id!, dtoUpdate);

        const { password, ...restUserDTO } = userDTO

        const userUpdated = { ...restUserDTO, ...dtoUpdate }

        expect(response).toMatchObject(
            userUpdated
        )


    });


    it('should set a temporal password and send it to the user mail', async () => {
        const userDTO = UserMother.dto();
        const userCreated = await userService.create(userDTO)

        const userBeforeCange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        await userService.requestTempPassword({
            email: userDTO.email,
            username: userDTO.username
        })
        const userAfterChange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password ")
            .addSelect("user.is_temporal_password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        expect(userBeforeCange?.password).not.toBe(userAfterChange?.password)
        expect(userAfterChange?.is_temporal_password).toBe(true)

    });


    it('should update an user password', async () => {
        const userDTO = UserMother.dto();
        const userCreated = await userService.create(userDTO)

        const userBeforeCange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        await userService.changePassword({
            password: "Yaidercc123*",
            repeatPassword: "Yaidercc123*"
        },
            userCreated?.user as User
        )
        const userAfterChange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .addSelect("user.is_temporal_password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        
        expect(userBeforeCange?.password).not.toBe(userAfterChange?.password)
        expect(userAfterChange?.is_temporal_password).toBe(false)
        expect(compareSync("Yaidercc123*", userAfterChange?.password!)).toBeTruthy()

    });

    it('should delete an user', async () => {
        const userDTO = UserMother.dto();
        const userCreated = await userService.create(userDTO)

        await userService.remove(userCreated?.user.id!)

        const userAfterChange = await userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        expect(userAfterChange?.is_active).toBeFalsy()

    });
})