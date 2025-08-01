import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "../user.service"
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { UserMother } from "./userMother";

describe("Integrations test UserService", () => {
    let service: UserService;
    let repository: Repository<User>
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: ":memory:",
                    entities: [User],
                    synchronize: true,
                    dropSchema: true
                }),
                TypeOrmModule.forFeature([User])
            ],
            providers: [UserService]
        }).compile()

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User))
    })

    beforeEach(async () => {
        await repository.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create an user", async () => {
        const userDTO = UserMother.dto();

        const response = await service.create(userDTO)

        expect(response).toBeDefined()
        expect(response).toMatchObject({
            full_name: userDTO.full_name,
            email: userDTO.email,
            phone: userDTO.phone,
            role: userDTO.role
        })
    })
})