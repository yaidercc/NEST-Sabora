import { Repository } from "typeorm";
import { UserService } from "./user.service"
import { User } from "./entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserMother } from "./__test__/userMother";

describe("Unit UserServices tests", () => {
    let service: UserService;
    let repo: Repository<User>

    const mockUserRepo = {
        create: jest.fn(),
        save: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo
                }
            ]
        }).compile()

        service = module.get<UserService>(UserService)
        repo = module.get<Repository<User>>(getRepositoryToken(User))
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