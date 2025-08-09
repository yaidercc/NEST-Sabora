import { EmployeeRoles } from "src/common/enums/roles";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity("employee_role")
export class EmployeeRole {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "enum", enum: EmployeeRoles})
    name: string

    @OneToMany(
        ()=> Employee,
        employee => employee.employee_role
    )
    employee: Employee[]
}