export declare class CreateOrderDetailDto {
    quantity: number;
    menu_item: string;
}
export declare class CreateOrderDto {
    table: string;
    customer?: string;
    is_customer_order: boolean;
    order_details: CreateOrderDetailDto[];
}
