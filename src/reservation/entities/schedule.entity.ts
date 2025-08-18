import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("schedule")
export class Schedule {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "int" })
    day_of_week: number;

    @Column({ type: 'time', nullable: true })
    opening_time?: string;

    @Column({ type: 'time', nullable: true })
    closing_time?: string;

    @Column({type: "boolean", default: false})
    is_closed: boolean;
}