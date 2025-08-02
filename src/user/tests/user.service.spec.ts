import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "../user.service";
import { User } from "../entities/user.entity";
import { UserMother } from "./userMother";
import { GeneralRole } from "../entities/general_role.entity";

describe("Unit UserServices tests", () => {
    let service: UserService;
    let repo: Repository<User>
    let roleRepo: Repository<GeneralRole>

    const mockUserRepo = {
        create: jest.fn(),
        save: jest.fn()
    }

    const mockRoleRepo = {
        createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ id: '1', name: 'admin' }),
        }),

    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
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

        service = module.get<UserService>(UserService)
        repo = module.get<Repository<User>>(getRepositoryToken(User))
        roleRepo = module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole))
    })

    it('should create an user', async () => {
        const userDTO = UserMother.dto()

        const createdUser = { ...userDTO, id: "484918ef-abc6-43a6-a26f-44bffe9a1ff8" }

        mockUserRepo.create.mockReturnValue(createdUser)
        mockUserRepo.save.mockReturnValue(createdUser)

        const result = await service.create(userDTO);

        expect(mockUserRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                ...userDTO,
                password: expect.any(String)
            })
        )
        expect(mockUserRepo.save).toHaveBeenCalledWith(createdUser)
        expect(result).toEqual(createdUser);
    });
})