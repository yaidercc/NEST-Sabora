import { genSaltSync, hashSync } from "bcrypt"
import { UserMother } from "../userMother"

export const userId = "484918ef-abc6-43a6-a26f-44bffe9a1ff8"
export const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: userId, ...UserMother.dto(), password: hashSync(UserMother.dto().password, genSaltSync()) }),
    }),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    update: jest.fn()
}

export const mockRoleRepo = {
    createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: '1', name: 'admin' }),
    }),
    findOneBy: jest.fn().mockResolvedValue({ id: '1', name: 'client' }),
}

export const mockConfigService = {
    get: jest.fn().mockReturnValue("SG.API_KEY")
}
