
import { CreateOrderDto } from "../dto/create-order.dto";
import { v4 as uuid } from "uuid"
import { Order } from "../entities/order.entity";
import { OrderService } from "../order.service";
// import { TableMother } from "./tableMother";
import { MenuItemMother } from "src/menu_item/tests/menuItemMother";
import { MenuItemService } from "src/menu_item/menu_item.service";
import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { TableService } from "src/table/table.service";

export class OrderMother {
    static dto(orderInfo?: Partial<CreateOrderDto>): CreateOrderDto {
        return {
            table: uuid(),
            order_details: orderInfo?.order_details ?? [
                {
                    quantity: 2,
                    menu_item: uuid()
                },
                {
                    quantity: 1,
                    menu_item: uuid()
                }
            ]

        }
    }

    // static async createManyTables(menuItemService: MenuItemService, tableService: TableService, orderService: OrderService, quantity: number): Promise<Order[]> {
    //     let orders: Order[] = [];

    //     for (let i = 0; i < quantity; i++) {
    //         const [table] = await TableMother.createManyTables(tableService, 1)
    //         const menuItems = await MenuItemMother.createManyMenuItems(menuItemService, 3)
    //         let order_details: { menu_item: string, quantity: number }[] = []

    //         for (let j = 0; j < menuItems.length; j++) {
    //             order_details.push({
    //                 menu_item: menuItems[j].id,
    //                 quantity: 2
    //             })

    //         }
    //         const order = await orderService.create(OrderMother.dto({
    //             table,
    //             order_details,

    //         }))
    //         if (order) {
    //             orders.push(order)
    //         }
    //     }
    //     return orders
    // }

}
