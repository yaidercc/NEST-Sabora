import { Order } from "src/order/entities/order.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
export declare class Table {
    id: string;
    capacity: number;
    name: string;
    is_active: boolean;
    reservation: Reservation;
    order: Order;
    beforeInserORUpdate(): void;
}
