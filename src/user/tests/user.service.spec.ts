import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "../user.service";
import { User } from "../entities/user.entity";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { mockConfigService, mockRoleRepo, mockUserRepo, userId } from "./mocks/user.mocks";
import * as sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([{ statusCode: 202 }]), // It simulates that the mail had sended successfuly
}));

describe("Unit UserServices tests", () => {
    let userService: UserService;
    let userRepository: Repository<User>
    let generalRoleRepository: Repository<GeneralRole>

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'secret123',
                    signOptions: { expiresIn: '1h' },
                }),
            ],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo
                },
                {
                    provide: getRepositoryToken(GeneralRole),
                    useValue: mockRoleRepo
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        }).compile()

        userService = module.get<UserService>(UserService)
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        generalRoleRepository = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))

    })


    it('should create an user', async () => {
        const userDTO = UserMother.dto()
        const user = { ...userDTO, id: userId }
        const { password, ...restInfoUser } = user
        const fakeToken = 'fake-jwt';

        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)

        mockUserRepo.create.mockReturnValue(user)
        mockUserRepo.save.mockReturnValue(user)

        const response = await userService.create(userDTO);

        expect(mockUserRepo.create).toHaveBeenCalled()
        expect(mockUserRepo.save).toHaveBeenCalled()
        expect(response).toEqual({
            user: {
                ...restInfoUser,
            },
            token: fakeToken
        });
    });


    it('should login an user', async () => {
        const userDTO = UserMother.dto()
        const user = { id: userId, ...userDTO }
        const { password, ...restInfoUser } = user

        const fakeToken = 'fake-jwt';
        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)

        const response = await userService.login({ username: userDTO.username, password: userDTO.password });

        expect(mockUserRepo.createQueryBuilder).toHaveBeenCalled()
        expect(response).toMatchObject({
            user: { ...restInfoUser, id: userId },
            token: fakeToken
        })
    });

    it('should return users created', async () => {
        const users = [
            UserMother.randomDTO(),
            UserMother.randomDTO(),
            UserMother.randomDTO()
        ]

        mockUserRepo.find.mockReturnValue(users)

        const response = await userService.findAll();

        expect(mockUserRepo.find).toHaveBeenCalled()
        expect(users).toEqual(response)
    });

    it('should update an user', async () => {
        const originalUser = { id: userId, ...UserMother.dto() }
        const dtoUpdate = { full_name: "jhonsito doe" }
        const updatedUser = { ...originalUser, ...dtoUpdate }

        mockUserRepo.preload.mockReturnValue(updatedUser)
        mockUserRepo.save.mockReturnValue(updatedUser)
        mockUserRepo.findOneBy.mockReturnValue(updatedUser)

        const response = await userService.update(userId, dtoUpdate)
        expect(mockUserRepo.preload).toHaveBeenCalled()
        expect(mockUserRepo.save).toHaveBeenCalled()
        expect(response).toMatchObject(updatedUser)
    });

    it('should set a temporal password and send it to the user mail', async () => {
        const originalUser = { id: userId, ...UserMother.dto() }

        await userService.requestTempPassword({
            email: originalUser.email,
            username: originalUser.username
        })

        expect(sgMail.send).toHaveBeenCalled()
        expect(mockUserRepo.save).toHaveBeenCalled()
        expect(mockUserRepo.findOneBy).toHaveBeenCalledWith({
            email: originalUser.email,
            username: originalUser.username
        })

    });


    it('should update a user password', async () => {
        const [userCreated] = await UserMother.createManyUsers(userService, 1);
        const user = userCreated.user as User;

        await userService.changePassword(
            {
                password: "Password123*",
                repeatPassword: "Password123*"
            },
            user
        );

        expect(mockUserRepo.preload).toHaveBeenCalledWith(user);
        expect(mockUserRepo.save).toHaveBeenCalled();
        
    });

})