import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "../user.service";
import { User } from "../entities/user.entity";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";
import { JwtService } from "@nestjs/jwt";
import { genSaltSync, hashSync } from "bcrypt";

describe("Unit UserServices tests", () => {
    let userService: UserService;
    let userRepository: Repository<User>
    let generalRoleRepository: Repository<GeneralRole>
    const userId = "484918ef-abc6-43a6-a26f-44bffe9a1ff8"

    const mockUserRepo = {
        create: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ id: userId, ...UserMother.dto(), password: hashSync(UserMother.dto().password, genSaltSync()) }),
        }),
        find: jest.fn()
    }

    const mockRoleRepo = {
        createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ id: '1', name: 'admin' }),
        }),
        findOneBy: jest.fn().mockResolvedValue({ id: '1', name: 'client' }),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                JwtService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo
                },
                {
                    provide: getRepositoryToken(GeneralRole),
                    useValue: mockRoleRepo
                }
            ]
        }).compile()

        userService = module.get<UserService>(UserService)
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        generalRoleRepository = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))

    })

    it('should create an user', async () => {
        const userDTO = UserMother.dto()

        const createdUser = { ...userDTO, id: userId }

        mockUserRepo.create.mockReturnValue(createdUser)
        mockUserRepo.save.mockReturnValue(createdUser)

        const result = await userService.create(userDTO);

        expect(mockUserRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                ...userDTO,
                password: expect.any(String)
            })
        )
        expect(mockUserRepo.save).toHaveBeenCalledWith(createdUser)
        expect(result).toEqual(createdUser);
    });


    it('should login an user', async () => {
        const userDTO = UserMother.dto()
        const foundUser = { id: userId, ...userDTO }
        const { password, ...restInfoUser } = foundUser

        const fakeToken = 'fake-jwt';
        jest.spyOn(JwtService.prototype, "sign").mockReturnValue(fakeToken)

        const result = await userService.login({ email: userDTO.email, password: userDTO.password });

        expect(mockUserRepo.createQueryBuilder).toHaveBeenCalled()
        expect(result).toMatchObject({
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

        const result = await userService.findAll();

        expect(mockUserRepo.find).toHaveBeenCalled()
        expect(users).toEqual(result)
    });
})