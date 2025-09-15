"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUploadService = exports.mockDataSource = exports.mockManager = void 0;
exports.mockManager = {
    findOneBy: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
};
exports.mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        release: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager: exports.mockManager
    })
};
exports.mockUploadService = {
    create: jest.fn().mockResolvedValue('http://mock-cloudinary-url.com/image.jpg'),
};
//# sourceMappingURL=common.mocks.js.map