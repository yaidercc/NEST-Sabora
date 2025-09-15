import { Order } from "src/order/entities/order.entity";
export declare class Invoice {
    id: string;
    order: Order;
    service_fee_rate: number;
    total: number;
    status: string;
    payment_method: string;
    stripe_session_id?: string;
    stripe_payment_intent_id?: string;
}
