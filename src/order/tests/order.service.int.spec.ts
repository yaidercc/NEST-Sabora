import { TestingModule } from "@nestjs/testing";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { OrderMother } from "./orderMother";
import { UserMother } from "src/user/tests/userMother";
import { User } from "src/user/entities/user.entity";
import { TableMother } from "src/table/tests/tableMother";
import { MenuItemMother } from "src/menu_item/tests/menuItemMother";
import { OrderStatus } from "../enum/order_status";

describe("Integrations test OrderService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;
    let orderMother: OrderMother;
    let user;


    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();
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
        user = await services.userService.findOne("jhonDoe");

    })

    beforeEach(async () => {
        await repositories.orderDetailsRepository.clear()
        await repositories.orderRepository.clear()
        await services.seedService.executeSEED()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create an order", async () => {
        const responseTable = await services.tableService.create(TableMother.dto())

        const responseUser = await services.userService.create(UserMother.dto())
        const menu_items = await MenuItemMother.createManyMenuItems(services.menuItemService, 2);

        const orderDTO = OrderMother.dto({
            customer: responseUser?.user.id,
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
        const subtotal = (menu_items[0].price * orderDTO.order_details[0].quantity) + (menu_items[1].price * orderDTO.order_details[1].quantity)


        const response = await services.orderService.create(orderDTO, responseUser?.user as User)

        expect(response).toBeDefined()
        expect([
            {
                menu_item: response?.order_details[0].menu_item.id,
                quantity: response?.order_details[0].quantity
            },
            {
                menu_item: response?.order_details[1].menu_item.id,
                quantity: response?.order_details[1].quantity
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
        expect(response?.table.id).toBe(orderDTO.table)
        expect(response?.subtotal).toBe(subtotal)
        expect(response?.customer?.id).toBe(orderDTO.customer)

    })


    it("Should get an order", async () => {
        const [order] = await orderMother.createManyOrders(1)

        const response = await services.orderService.findOne(order.id, order.user)

        expect(response).toBeDefined()
        expect(response).toMatchObject(order)
    })

    it("Should return all orders", async () => {
        const [order1, order2] = await orderMother.createManyOrders(2)
        const response = await services.orderService.findAll({ limit: 10, offset: 0 }, user)

        expect(response).toBeDefined()
        expect(response).toHaveLength(2)
        expect(response).toEqual(expect.arrayContaining([order1, order2]))
    })


    it("Should update an order", async () => {
        const [order] = await orderMother.createManyOrders(1)
        const dtoUpdate = { order_details: order.order_details.map(item => ({ menu_item: item.menu_item.id, quantity: item.quantity })) }
        dtoUpdate.order_details[0].quantity = 20;

        const response = await services.orderService.update(order.id, dtoUpdate, user)
        
        expect(response).toBeDefined()
        expect([
            {
                menu_item: response?.order_details[0].menu_item.id,
                quantity: response?.order_details[0].quantity
            },
            {
                menu_item: response?.order_details[1].menu_item.id,
                quantity: response?.order_details[1].quantity
            }
        ]).toEqual([
            {
                menu_item: dtoUpdate.order_details[0].menu_item,
                quantity: dtoUpdate?.order_details[0].quantity
            },
            {
                menu_item: dtoUpdate.order_details[1].menu_item,
                quantity: dtoUpdate?.order_details[1].quantity
            }
        ])
    })

    it("Should change order status", async () => {
        const [order] = await orderMother.createManyOrders(1)
        const response = await services.orderService.changeOrderStatus(order.id,{status: OrderStatus.CONFIRMED}, user)

        expect(response?.status).toBe(OrderStatus.CONFIRMED)
    });

})