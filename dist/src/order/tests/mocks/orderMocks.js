"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockMenuItemService = exports.mockOrderDetail = exports.mockOrder = exports.orderId = void 0;
exports.orderId = "504fbcc7-c8d9-4fff-a301-366e6eb5cfd6";
exports.mockOrder = {
    create: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    createQueryBuilder: jest.fn(),
    createQueryRunner: jest.fn(),
};
exports.mockOrderDetail = {
    create: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    createQueryRunner: jest.fn(),
};
exports.mockMenuItemService = {
    findOne: jest.fn()
};
//# sourceMappingURL=orderMocks.js.map