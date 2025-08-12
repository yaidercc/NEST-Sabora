import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EmployeeRole } from "./employee_role.entity";
import { User } from "src/user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("employee")
export class Employee {
    @ApiProperty({
        description: "Employee id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"

    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        description: "Hiring date",
        example: "2020-10-10"
    })
    @Column("date")
    hiring_date: Date;


    @Column("boolean", { default: true, select: false })
    is_active: boolean

    @OneToOne(
        () => User,
        user => user.employee,
        
    )
    /**
     * When is a 1:1 relations typeorm needs to know which table will store the fk of the other table
     * so we´ve to use JoinColumn to say typeorm in which table we want to store the fk
     */
    @JoinColumn()
    user: User;

    @ApiProperty({
        description: "employee role",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @ManyToOne(
        () => EmployeeRole,
        employee_role => employee_role.employee,
        { eager: true }
    )
    employee_role: EmployeeRole;
}
