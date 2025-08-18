import { TestingModule } from "@nestjs/testing";
import { User } from "../entities/user.entity";
import { UserMother } from "./userMother";
import { JwtService } from "@nestjs/jwt";
import { compareSync } from "bcrypt";
import { GeneralRoles } from "src/common/enums/roles";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";


jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([{ statusCode: 202 }]), // It simulates that the mail had sended successfuly
}));

describe("Integrations test UserService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;

    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();

        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    beforeEach(async () => {
         await TestHelpers.setupTestData(services.seedService)
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create an user", async () => {
        const userDTO = UserMother.dto();
        const fakeToken = 'fake-jwt'
        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)

        const response = await services.userService.create(userDTO)

        const clientRole = await repositories.generalRoleRepository.findOneBy({ name: GeneralRoles.CLIENT })
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

        const userCreated = await services.userService.create(userDTO)

        const response = await services.userService.login({ username: userDTO.username, password: userDTO.password });

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
        await UserMother.createManyUsers(services.userService, 2);
        const response = await services.userService.findAll();

        expect(response.length).toBe(4)
    });

    it('should update an user', async () => {
        const userDTO = UserMother.dto();
        const dtoUpdate = { full_name: "jhonsito doe" }

        const userCreated = await services.userService.create(userDTO)

        const response = await services.userService.update(userCreated?.user.id!, dtoUpdate);

        const { password, ...restUserDTO } = userDTO

        const userUpdated = { ...restUserDTO, ...dtoUpdate }

        expect(response).toMatchObject(
            userUpdated
        )


    });


    it('should set a temporal password and send it to the user mail', async () => {
        const userDTO = UserMother.dto();
        const userCreated = await services.userService.create(userDTO)

        const userBeforeCange = await repositories.userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        await services.userService.requestTempPassword({
            email: userDTO.email,
            username: userDTO.username
        })
        const userAfterChange = await repositories.userRepository
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
        const userCreated = await services.userService.create(userDTO)

        const userBeforeCange = await repositories.userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        await services.userService.changePassword({
            password: "Yaidercc123*",
            repeatPassword: "Yaidercc123*"
        },
            userCreated?.user as User
        )
        const userAfterChange = await repositories.userRepository
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
        const userCreated = await services.userService.create(userDTO)

        await services.userService.remove(userCreated?.user.id!)

        const userAfterChange = await repositories.userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.id = :id", { id: userCreated?.user.id })
            .getOne();

        expect(userAfterChange?.is_active).toBeFalsy()

    });
})