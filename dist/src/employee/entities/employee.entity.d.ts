import { EmployeeRole } from "./employee_role.entity";
import { User } from "src/user/entities/user.entity";
export declare class Employee {
    id: string;
    hiring_date: Date;
    is_active: boolean;
    user: User;
    employee_role: EmployeeRole;
}
