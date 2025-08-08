import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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
    @Column("text", { unique: true })
    username: string;

    @ApiProperty({
        example: "user@gmail.com",
        description: "User email"
    })
    @Index()
    @Column("text")
    email: string;

    @ApiProperty({
        example: "user123*",
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

    @Column("boolean", {
        default: true,
        select: false
    })
    is_active: boolean;

    @Column("boolean", {
        default: false,
        select: false
    })
    is_temporal_password: boolean;

    @ApiProperty({
        example: {
            id: "61773b80-ee92-438b-bb07-ec9ed32300cd",
            name: "client"
        },
        description: "User role"
    })
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


