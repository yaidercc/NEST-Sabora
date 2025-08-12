import { EmployeeMother } from "../employeeMother"

export const employeeId = "8a95fd25-7b54-48f1-804e-4bd5ca168e69"

export const mockEmployeeRepo = {
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    findOne: jest.fn()
}

export const mockEmployeeRoleRepo = {
}

export const mockManager = {
    findOneBy: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnValue({ id: employeeId, ...EmployeeMother.dto()}),
    save: jest.fn().mockReturnThis(),
}

export const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(
        {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            release: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            manager: mockManager
        }
    )
}

