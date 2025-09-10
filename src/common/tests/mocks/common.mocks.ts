export const mockManager = {
    findOneBy: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),  
    save: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
   
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

export const mockUploadService = {
        create: jest.fn().mockResolvedValue('http://mock-cloudinary-url.com/image.jpg'),
    };


