import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GeneralRole } from "./general_role.entity";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    full_name: string;

    @Column("text")
    email: string;

    @Column("text")
    password: string;

    @Column("text")
    phone: string;

    @Column("boolean", {
        default: true
    })
    is_active: boolean;

    @ManyToOne(() => GeneralRole, role => role.user, { eager: true })
    role: GeneralRole;
}


