"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockFile = exports.mockMenuItemRepo = exports.menuItemId = void 0;
exports.menuItemId = "8a95fd25-7b54-48f1-804e-4bd5ca168e69";
exports.mockMenuItemRepo = {
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn()
};
exports.mockFile = {
    fieldname: 'file',
    originalname: 'test-product.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    destination: '/tmp/uploads',
    filename: 'test-product-123456789.jpg',
    path: '/tmp/uploads/test-product-123456789.jpg',
    buffer: Buffer.from('fake-image-data'),
    stream: {}
};
//# sourceMappingURL=menuItem.mock.js.map