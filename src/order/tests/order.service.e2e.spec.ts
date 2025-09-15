import { TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { TestDatabaseManager } from "src/common/tests/test-database";
import { AdminLogin, TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { OrderMother } from "./orderMother";
import { TableMother } from "src/table/tests/tableMother";
import { UserMother } from "src/user/tests/userMother";
import { MenuItemMother } from "src/menu_item/tests/menuItemMother";
import { OrderStatus } from "../enum/order_status";

describe("Integrations test TablesService", () => {
    let module: TestingModule;
    let app: INestApplication
    let adminLogin: AdminLogin | undefined
    let services: TestServices
    let repositories: TestRepositories
    let orderMother: OrderMother;
    beforeAll(async () => {
        // Initializing module and Nest app
        const testDB = await TestDatabaseManager.initializeE2E()
        app = testDB.app
        module = testDB.module
        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
        orderMother = new OrderMother(
            services.menuItemService,
            services.tableService,
            services.orderService,
            services.userService,
            services.employeesService,
            repositories.employeeRoleRepository
        )
    })

    // Cleaning up the data before each test
    beforeEach(async () => {
        await services.seedService.executeSEED();
        adminLogin = await TestHelpers.loginAsAdmin(app);
    })

    // Closing the nest aplication at the end of the tests
    afterAll(async () => {
        await TestDatabaseManager.cleanUp();
    });

    it("POST /order", async () => {
        const responseTable = await services.tableService.create(TableMother.dto())

        const menu_items = await MenuItemMother.createManyMenuItems(services.menuItemService, 2);

        const orderDTO = OrderMother.dto({
            is_customer_order: true,
            table: responseTable?.id,
            order_details: [
                {
                    menu_item: menu_items[0].id,
                    quantity: 1
                },
                {
                    menu_item: menu_items[1].id,
                    quantity: 4
                }
            ]
        })
        
       
        const subtotal = ( menu_items[0].price * orderDTO.order_details[0].quantity) + (menu_items[1].price * orderDTO.order_details[1].quantity)

        const response = await request(app.getHttpServer())
            .post('/order')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(orderDTO)

        expect(response.status).toBe(201)
        expect(response).toBeDefined()
        expect([
            {
                menu_item: response.body?.order_details[0].menu_item.id,
                quantity: response.body?.order_details[0].quantity
            },
            {
                menu_item: response.body?.order_details[1].menu_item.id,
                quantity: response.body?.order_details[1].quantity
            }
        ]).toEqual([
            {
                menu_item: menu_items[0].id,
                quantity: orderDTO?.order_details[0].quantity
            },
            {
                menu_item: menu_items[1].id,
                quantity: orderDTO?.order_details[1].quantity
            }
        ])

        expect(response.body?.table.id).toBe(orderDTO.table)
        expect(response.body?.subtotal).toBe(subtotal.toFixed(2))
        expect(response.body?.customer?.id).toBe(adminLogin?.user.id)
    })

    it("GET /order/term", async () => {
        const [order] = await orderMother.createManyOrders(1)

        const response = await request(app.getHttpServer())
            .get(`/order/${order.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: order.id,
            status: order.status,
            is_customer_order: order.is_customer_order,
            date: order.date,
            subtotal: order.subtotal,
            user: expect.objectContaining({
                id: order.user.id,
                full_name: order.user.full_name,
                email: order.user.email,
                phone: order.user.phone
            }),
            table: expect.objectContaining({
                id: order.table.id,
                name: order.table.name
            })
        });
    })


    it("GET /order", async () => {
        await orderMother.createManyOrders(2)

        const response = await request(app.getHttpServer())
            .get(`/order/?limit=${10}&offset=${0}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)
    })



    it("PATCH /order", async () => {
        const [order] = await orderMother.createManyOrders(1)
        const dtoUpdate = { order_details: order.order_details.map(item => ({ menu_item: item.menu_item.id, quantity: item.quantity })) }
        dtoUpdate.order_details[0].quantity = 20;

        const response = await request(app.getHttpServer())
            .patch(`/order/${order.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(dtoUpdate)

        expect(response.status).toBe(200)
        expect(response.body.order_details[0].quantity).toBe(dtoUpdate.order_details[0].quantity)

    })



    it("PATCH /order/change-order-status", async () => {
        const [order] = await orderMother.createManyOrders(1)
        const dtoUpdate = { status: OrderStatus.CONFIRMED }

        const response = await request(app.getHttpServer())
            .patch(`/order/change-order-status/${order.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(dtoUpdate)

        expect(response.status).toBe(200)
        expect(response.body.status).toBe(dtoUpdate.status)

    })


})