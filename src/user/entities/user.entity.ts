import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("text")
    email: string;

    @Column("text")
    password: string;

    @Column("text")
    phone: string;

    @Column("bool", {
        default: true
    })
    is_active: boolean;
}


