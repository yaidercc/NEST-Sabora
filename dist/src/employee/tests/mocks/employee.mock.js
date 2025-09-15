"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockEmployeeRoleRepo = exports.mockEmployeeRepo = exports.employeeId = void 0;
exports.employeeId = "8a95fd25-7b54-48f1-804e-4bd5ca168e69";
exports.mockEmployeeRepo = {
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn()
};
exports.mockEmployeeRoleRepo = {
    findOneBy: jest.fn().mockReturnThis()
};
//# sourceMappingURL=employee.mock.js.map