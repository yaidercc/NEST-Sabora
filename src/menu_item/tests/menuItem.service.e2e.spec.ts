import { GeneralRole } from "src/user/entities/general_role.entity";
import { TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { GeneralRoles } from "src/common/enums/roles";
import { AdminLogin, TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { MenuItemMother } from "./menuItemMother";
import { mockFile } from "./mocks/menuItem.mock";
// TODO: implement test to upload an image
describe("Integrations test MenuItemService", () => {
    let module: TestingModule;
    let app: INestApplication
    let clientRole: GeneralRole | null
    let adminLogin: AdminLogin | undefined
    let services: TestServices
    let repositories: TestRepositories

    beforeAll(async () => {
        const testDB = await TestDatabaseManager.initializeE2E()
        app = testDB.app
        module = testDB.module

        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
    })

    beforeEach(async () => {

        adminLogin = await TestHelpers.loginAsAdmin(app);
        clientRole = await repositories.generalRoleRepository.findOneBy({ name: GeneralRoles.CLIENT })
    })

    afterAll(async () => {
        await TestDatabaseManager.cleanUp();
    });

    afterEach(async () => {
        await services.seedService.executeSEED();
        jest.restoreAllMocks();
    });

    it("POST /menu-item", async () => {
        const menuItemDto = MenuItemMother.dto()

        const response = await request(app.getHttpServer())
            .post('/menu-item')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .field('name', menuItemDto.name)
            .field('description', menuItemDto.description)
            .field('price', menuItemDto.price)
            .field('menu_item_type', menuItemDto.menu_item_type)
            .attach('file', mockFile.buffer, mockFile.filename)

        expect(response.status).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body).toMatchObject({
            ...menuItemDto,
            price: menuItemDto.price.toString(),
            name: menuItemDto.name.toLowerCase()
        })
    })

    it("GET /menu-item/:term", async () => {
        const [menuItem] = await MenuItemMother.createManyMenuItems(services.menuItemService, 1)

        const response = await request(app.getHttpServer())
            .get(`/menu-item/${menuItem.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body).toMatchObject({
            id: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            menu_item_type: menuItem.menu_item_type,
            image: menuItem.image
        })

    })

    it("GET /menu-item", async () => {
        await MenuItemMother.createManyMenuItems(services.menuItemService, 2)

        const response = await request(app.getHttpServer())
            .get(`/menu-item/?limit=${10}&offset=${0}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.length).toBe(6)

    })

    it('PATCH /menu-item', async () => {
        const [menuItem] = await MenuItemMother.createManyMenuItems(services.menuItemService, 1)
        const dtoUpdate = { price: 100000 }

        const response = await request(app.getHttpServer())
            .patch(`/menu-item/${menuItem.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(dtoUpdate)
        expect(response.status).toBe(200)
        expect(response.body.price).toBe(dtoUpdate.price)

    });


    it('DELETE /employee', async () => {
        const [menuItem] = await MenuItemMother.createManyMenuItems(services.menuItemService, 1)


        const response = await request(app.getHttpServer())
            .delete(`/menu-item/${menuItem.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)


        const menuItemAfterChange = await repositories.employeeRepository
            .createQueryBuilder("menuItem")
            .addSelect("menuItem.is_active")
            .where("menuItem.id = :id", { id: menuItem.id })
            .getOne();

        expect(response.status).toBe(200)
        expect(menuItem?.is_active).toBeTruthy()
        expect(menuItemAfterChange?.is_active).toBeFalsy()

    });
})