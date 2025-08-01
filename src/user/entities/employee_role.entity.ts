import { Entity } from "typeorm";

@Entity("employee_role")
class EmployeeRole {
    id: string;

    name: string
}