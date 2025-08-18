import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../enum/status";
import { Table } from "src/table/entities/table.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UserMother } from "src/user/tests/userMother";

@Entity("reservation")
export class Reservation {

    @ApiProperty({
        description: "Reservation id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        description: "User",
        type: () => User,
    })
    @ManyToOne(
        () => User,
        user => user.reservation,
        { eager: true }
    )
    user: User;

    @ApiProperty({
        description: "Table",
        type: () => Table,
    })
    @ManyToOne(
        () => Table,
        table => table.reservation,
        { eager: true }
    )
    table: Table;

    @ApiProperty({
        description: "Reservation date",
        example: "2020-12-12"
    })
    @Column("date")
    date: Date;

    @ApiProperty({
        description: "Reservation time start",
        example: "12:00:00"
    })
    @Column({ type: 'time' })
    time_start: string;

    @ApiProperty({
        description: "Reservation time end",
        example: "14:00:00"
    })
    @Column({ type: 'time' })
    time_end: string;

    @ApiProperty({
        description: "Reservation party size",
        example: 5
    })
    @Column({ type: "int" })
    party_size: number;

    @ApiProperty({
        description: "Reservation status",
        example: Status.CONFIRMED
    })
    @Column({ type: "simple-enum", enum: Status })
    status: string;

}

