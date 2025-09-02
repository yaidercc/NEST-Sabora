import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { menuItemId, mockFile, mockMenuItemRepo } from "./mocks/menuItem.mock";
import { MenuItem } from "../entities/menu_item.entity";
import { MenuItemService } from "../menu_item.service";
import { MenuItemMother } from "./menuItemMother";
import { UploadService } from "src/common/services/upload.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnvConfiguration } from "src/config/env.config";
import { JoiEnvValidation } from "src/config/joi.validation";
import { v4 as uuid } from "uuid"
import { BadRequestException } from "@nestjs/common";

describe("Unit MenuItemServices tests", () => {
    let menuItemService: MenuItemService;
    let uploadService: UploadService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({
                envFilePath: ".env.test",
                load: [EnvConfiguration],
                validationSchema: JoiEnvValidation
            }),],
            providers: [
                MenuItemService,
                UploadService,
                ConfigService,

                {
                    provide: getRepositoryToken(MenuItem),
                    useValue: mockMenuItemRepo
                }
            ]
        }).compile()

        menuItemService = module.get<MenuItemService>(MenuItemService)
        uploadService = module.get<UploadService>(UploadService)

    })


    it('should create a menu item', async () => {
        const menuItemDTO = MenuItemMother.dto()
        const menuItemCreated = { ...menuItemDTO, id: menuItemId }

        mockMenuItemRepo.find.mockResolvedValue(true)
        mockMenuItemRepo.create.mockResolvedValue(menuItemCreated)
        mockMenuItemRepo.save.mockResolvedValue(menuItemCreated)

        const response = await menuItemService.create(menuItemDTO, mockFile)

        expect(mockMenuItemRepo.create).toHaveBeenCalled()
        expect(mockMenuItemRepo.save).toHaveBeenCalled()
        expect(response).toMatchObject(menuItemCreated)

    });


    it('should return a menu item', async () => {
        const menuItemDTO = { id: menuItemId, ...MenuItemMother.dto() }

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockMenuItemRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        mockMenuItemRepo.findOneBy.mockReturnValue(menuItemDTO)


        const response = await menuItemService.findOne(menuItemId);

        expect(mockMenuItemRepo.createQueryBuilder).toHaveBeenCalled()
        expect(mockMenuItemRepo.findOneBy).toHaveBeenCalled()
        expect(response).toEqual(menuItemDTO);
    });

    it('should return all menu items', async () => {
        const menuItemCreated1 = { ...MenuItemMother.dto(), id: menuItemId }
        const menuItemCreated2 = { ...MenuItemMother.dto(), id: uuid() }


        mockMenuItemRepo.find.mockReturnValue([
            menuItemCreated1,
            menuItemCreated2
        ])

        const response = await menuItemService.findAll({ limit: 10, offset: 0 })

        expect(mockMenuItemRepo.find).toHaveBeenCalled()
        expect(response).toEqual([
            menuItemCreated1,
            menuItemCreated2
        ])

    });


    it('should update an employee', async () => {
        const originalmenuItem = { ...MenuItemMother.dto(), id: menuItemId }
        const dtoUpdate = { price: 80000 }
        const updatedMenuItem = { ...originalmenuItem, ...dtoUpdate }


        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockMenuItemRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        mockMenuItemRepo.update.mockReturnValue(updatedMenuItem)
        mockMenuItemRepo.findOneBy.mockReturnValue(updatedMenuItem)

        const response = await menuItemService.update(menuItemId, dtoUpdate)

        expect(mockMenuItemRepo.findOneBy).toHaveBeenCalled()
        expect(mockMenuItemRepo.update).toHaveBeenCalled()
        expect(mockMenuItemRepo.createQueryBuilder).toHaveBeenCalled()
        expect(response).toMatchObject(updatedMenuItem)


    });

    it('should delete a menu item', async () => {
        const menuItemCreated = { ...MenuItemMother.dto(), id: menuItemId }

        mockMenuItemRepo.findOneBy.mockReturnValue(menuItemCreated)
        await menuItemService.remove(menuItemCreated.id)

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: false })
        }

        mockMenuItemRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder)


        expect(mockMenuItemRepo.update).toHaveBeenCalled()
        await expect(
            menuItemService.findOne(menuItemId)
        ).rejects.toThrow(BadRequestException);

    });

})