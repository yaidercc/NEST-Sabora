

export const employeeId = "8a95fd25-7b54-48f1-804e-4bd5ca168e69"

export const mockEmployeeRepo = {
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn()
}

export const mockEmployeeRoleRepo = {
    findOneBy: jest.fn().mockReturnThis()
}

