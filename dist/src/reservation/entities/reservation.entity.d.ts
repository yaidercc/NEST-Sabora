import { User } from "src/user/entities/user.entity";
import { Table } from "src/table/entities/table.entity";
export declare class Reservation {
    id: string;
    user: User;
    table: Table;
    date: Date;
    time_start: string;
    time_end: string;
    party_size: number;
    status: string;
}
