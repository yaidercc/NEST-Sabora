import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GeneralRole } from "./general_role.entity";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @Column("text")
    full_name: string;

    @Index()
    @Column("text", { unique: true })
    email: string;

    @Column("text", { select: false })
    password: string;

    @Index()
    @Column("text", {unique: true})
    phone: string;

    @Column("boolean", {
        default: true
    })
    is_active: boolean;

    @ManyToOne(() => GeneralRole, role => role.user, { eager: true })
    role: GeneralRole;
}


