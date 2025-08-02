import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("general_role")
export class GeneralRole {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 50 })
    name: string;

    @OneToMany(
        () => User,
        user => user.role,
        {eager: false}
    )
    user: User[]
}
