export const mockManager = {
    findOneBy: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),  // TODO: add this in users .mockReturnValue({ id: employeeId, ...EmployeeMother.dto() })
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

