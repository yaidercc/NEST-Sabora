import { Table } from "src/table/entities/table.entity";
import { User } from "src/user/entities/user.entity";
import { OrderDetail } from "./order_detail.entity";
export declare class Order {
    id: string;
    user: User;
    customer?: User;
    table: Table;
    order_details: OrderDetail[];
    status: string;
    is_customer_order: boolean;
    date: string;
    subtotal: number;
    is_active: boolean;
}
