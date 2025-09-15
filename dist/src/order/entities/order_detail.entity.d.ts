import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { Order } from "./order.entity";
export declare class OrderDetail {
    id: string;
    quantity: number;
    menu_item: MenuItem;
    order: Order;
    is_active: boolean;
}
