import { Repository } from "typeorm";
import { UserService } from "./user.service"
import { User } from "./entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("UserController tests", () => {
    let service: UserService;
    let repo: Repository<User>

    const mockPlatoRepo = {
        findOneBy: jest.fn().mockResolvedValue([{ name: "yaider" }])
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockPlatoRepo
                }
            ]
        }).compile()

        service = module.get<UserService>(UserService)
        repo = module.get<Repository<User>>(getRepositoryToken(User))
    })

    it('should return platos', async () => {
        const result = await service.findOne("holi");
        expect(result).toEqual([{ name: 'yaider' }]);
        expect(mockPlatoRepo.findOneBy).toHaveBeenCalled();
    });
})