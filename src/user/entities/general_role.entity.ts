import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { GeneralRoles } from "src/common/enums/roles";

@Entity("general_role")
export class GeneralRole {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "simple-enum", enum: GeneralRoles })
    name: string;

    @OneToMany(
        () => User,
        user => user.role,
        { eager: false }
    )
    user: User[]
}
