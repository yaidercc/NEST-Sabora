import { TestingModule } from "@nestjs/testing";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { MenuItemMother } from "./menuItemMother";
import { mockFile } from "./mocks/menuItem.mock";


describe("Integrations test MenuItemService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;

    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();
        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    beforeEach(async () => {
        await repositories.menuItemRepository.clear()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create a menu item", async () => {
        const menuItemDto = MenuItemMother.dto();
        const responseMenuItem = await services.menuItemService.create(menuItemDto, mockFile)

        expect(responseMenuItem).toBeDefined()
        expect(responseMenuItem).toMatchObject({
            ...menuItemDto,
            name: menuItemDto.name.toLowerCase()
        })

    })


    it("Should return an menu item", async () => {
        const [menuItem] = await MenuItemMother.createManyMenuItems(services.menuItemService, 1)
        const response = await services.menuItemService.findOne(menuItem.id)
        expect(response).toMatchObject({
            id: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            menu_item_type: menuItem.menu_item_type,
            image: menuItem.image,
        })
    })

    it("should return all menu items", async () => {
        await MenuItemMother.createManyMenuItems(services.menuItemService, 2)

        const response = await services.menuItemService.findAll({ limit: 10, offset: 0 })

        expect(response).toBeDefined()
        expect(response.length).toBe(2)

    })

    it('should update a menu item', async () => {
        const [menuItem] = await MenuItemMother.createManyMenuItems(services.menuItemService, 1)
        const dtoUpdate = { price: 80000 }

        const response = await services.menuItemService.update(menuItem.id, dtoUpdate)

        expect(response?.price).toBe(dtoUpdate.price)


    });

    it('should delete a menu item', async () => {
        const [menuItem] = await MenuItemMother.createManyMenuItems(services.menuItemService, 1)

        await services.menuItemService.remove(menuItem.id)
        const response = await repositories.employeeRepository.createQueryBuilder("menuItem")
            .select("is_active")
            .where("menuItem.id=:id", {
                id: menuItem.id,
            })
            .getOne()

        expect(response?.is_active).toBeFalsy()

    });

})

