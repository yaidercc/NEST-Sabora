import { OrderDetail } from "src/order/entities/order_detail.entity";
export declare class MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    menu_item_type: string;
    image: string;
    is_active: boolean;
    order_detail: OrderDetail;
}
