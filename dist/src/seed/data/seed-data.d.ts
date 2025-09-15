interface GeneralRole {
    id: string;
    name: string;
}
export interface EmployeeRole {
    id: string;
    name: string;
}
interface User {
    id: string;
    full_name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
}
interface Employee {
    id: string;
    user?: User;
    employee_role?: EmployeeRole;
    hiring_date: string;
}
interface Table {
    id: string;
    name: string;
    capacity: number;
}
interface Schedule {
    id: string;
    day_of_week: number;
    opening_time?: string;
    closing_time?: string;
    is_closed: boolean;
}
interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    menu_item_type: string;
}
interface InitialData {
    generalRoles: GeneralRole[];
    employeeRoles: EmployeeRole[];
    user: User[];
    employee: Employee;
    tables: Table[];
    schedule: Schedule[];
    menuItem: MenuItem[];
}
export declare const initialData: InitialData;
export {};
