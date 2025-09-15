"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUserService = exports.mockConfigService = exports.mockRoleRepo = exports.mockQueryBuilder = exports.mockUserRepo = exports.userId = void 0;
exports.userId = "484918ef-abc6-43a6-a26f-44bffe9a1ff8";
exports.mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    update: jest.fn()
};
exports.mockQueryBuilder = {
    where: jest.fn(),
    select: jest.fn(),
    addSelect: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    getOne: jest.fn(),
    getRawOne: jest.fn(),
};
exports.mockRoleRepo = {
    createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: '1', name: 'admin' }),
    }),
    findOneBy: jest.fn().mockResolvedValue({ id: '1', name: 'client' }),
};
exports.mockConfigService = {
    get: jest.fn().mockReturnValue("SG.API_KEY")
};
exports.mockUserService = {
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
};
//# sourceMappingURL=user.mocks.js.map