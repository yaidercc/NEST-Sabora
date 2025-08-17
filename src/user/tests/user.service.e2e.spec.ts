import { TestingModule } from "@nestjs/testing";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { JwtService } from "@nestjs/jwt";
import { compareSync } from "bcrypt";
import { GeneralRoles } from "src/common/enums/roles";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { AdminLogin, TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { EmployeeMother } from "src/employee/tests/employeeMother";

describe("E2E test UserService", () => {
    let module: TestingModule;
    let app: INestApplication
    let clientRole: GeneralRole | null
    let adminLogin: AdminLogin | undefined
    let services: TestServices
    let repositories: TestRepositories
    beforeAll(async () => {
        // Initializing module and Nest app
        const testDB = await TestDatabaseManager.initializeE2E()
        app = testDB.app
        module = testDB.module

        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    // Cleaning up the data before each test
    beforeEach(async () => {
        await services.seedService.executeSEED();
        adminLogin = await TestHelpers.loginAsAdmin(app);
        clientRole = await TestHelpers.getRepositories(module).generalRoleRepository.findOneBy({ name: GeneralRoles.CLIENT })
    })

    // Closing the nest aplication at the end of the tests
    afterAll(async () => {
        await TestDatabaseManager.cleanUp();
    });

    // Reseting mocks after each test
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
        await services.userService.create(userDTO)

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
        await UserMother.createManyUsers(services.userService, 2);
        const response = await request(app.getHttpServer())
            .get("/user")
            .set('Authorization', `Bearer ${adminLogin?.token}`);
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(3)
    })

    it("GET /user/:term", async () => {
        const [{ user }] = await UserMother.createManyUsers(services.userService, 1);
        const response = await request(app.getHttpServer())
            .get(`/user/${user.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: {
                id: clientRole?.id,
                name: clientRole?.name
            },
        })
    })



    it("GET /user/profile", async () => {
        await UserMother.createManyUsers(services.userService, 2);

        const response = await request(app.getHttpServer())
            .get("/user/profile")
            .set('Authorization', `Bearer ${adminLogin?.token}`);

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(adminLogin?.user!)
    })

    it("UPDATE /user", async () => {
        const [{ user, token }] = await UserMother.createManyUsers(services.userService, 1);

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
        const [{ user, token }] = await UserMother.createManyUsers(services.userService, 1)


        const userBeforeCange = await repositories.userRepository
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

        const userAfterChange = await repositories.userRepository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .addSelect("user.is_temporal_password")
            .where("user.id = :id", { id: user.id })
            .getOne();

        expect(userBeforeCange?.password).not.toBe(userAfterChange?.password)
        expect(userAfterChange?.is_temporal_password).toBe(true)
    });


    it('POST /user/change-password', async () => {
        const [{ user, token }] = await UserMother.createManyUsers(services.userService, 1);


        const userBeforeCange = await repositories.userRepository
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

        const userAfterChange = await repositories.userRepository
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
        const [{ user }] = await UserMother.createManyUsers(services.userService, 1)
        await request(app.getHttpServer())
            .delete(`/user/${user.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        const userAfterChange = await repositories.userRepository
            .createQueryBuilder("user")
            .select("user.is_active")
            .where("user.id = :id", { id: user.id })
            .getRawOne()

        expect(userAfterChange.is_active).toBeFalsy()
    });

})