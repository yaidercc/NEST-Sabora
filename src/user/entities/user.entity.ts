import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GeneralRole } from "./general_role.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("user")
export class User {

    @ApiProperty({
        example: "d3aa5adb-28b4-4686-827d-a2111141e558",
        description: "User ID",
        uniqueItems: true
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        example: "Jhon Doe",
        description: "User fullname"
    })
    @Index()
    @Column("text")
    full_name: string;

    @ApiProperty({
        example: "JhonDoe",
        description: "Username"
    })
    @Index()
    @Column("text")
    username: string;

    @ApiProperty({
        example: "user@gmail.com",
        description: "User email"
    })
    @Index()
    @Column("text", { unique: true })
    email: string;

    @ApiProperty({
        example: "user123",
        description: "User password"
    })
    @Column("text", { select: false })
    password: string;

    @ApiProperty({
        example: "57356251432",
        description: "User phone"
    })
    @Index()
    @Column("text", { unique: true })
    phone: string;


    @ApiProperty({
        example: true,
        description: "is user active"
    })
    @Column("boolean", {
        default: true
    })
    is_active: boolean;

    @ManyToOne(() => GeneralRole, role => role.user, { eager: true })
    role: GeneralRole;


    @BeforeInsert()
    @BeforeUpdate()
    beforeInsertOrUpdate() {
        if (this.email) this.email = this.email.toLowerCase()
        if (this.full_name) this.full_name = this.full_name.toLowerCase()
        if (this.phone) this.phone = this.phone.toLowerCase()
    }
}


