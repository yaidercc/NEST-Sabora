import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../enum/status";
import { Table } from "src/table/entities/table.entity";

@Entity("reservation")
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(
        () => User,
        user => user.reservation,
        { eager: true }
    )
    user: User;

    @ManyToOne(
        () => Table,
        table => table.reservation,
        { eager: true }
    )
    table: Table;

    @Column("date")
    date: Date;

    @Column({ type: 'time' })
    time_start: string;

    @Column({ type: 'time' })
    time_end: string;

    @Column({ type: "int" })
    party_size: number;

    @Column({ type: "simple-enum", enum: Status, default: Status.PENDING })
    status: string;

}

