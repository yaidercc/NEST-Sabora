import { GeneralRole } from "./general_role.entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Order } from "src/order/entities/order.entity";
export declare class User {
    id: string;
    full_name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    is_active: boolean;
    is_temporal_password: boolean;
    role: GeneralRole;
    employee?: Employee;
    reservation: Reservation;
    order: Order;
    beforeInsertOrUpdate(): void;
}
