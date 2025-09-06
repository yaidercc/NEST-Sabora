import { Table } from "src/table/entities/table.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order_status";
import { OrderDetail } from "./order_detail.entity";

@Entity("order")
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => User,
        user => user.order,
        { eager: true }
    )
    @Index()
    user: User;

    @ManyToOne(
        () => Table,
        table => table.order,
        { eager: true }
    )
    table: Table;

    @OneToMany(
        () => OrderDetail,
        order_detail => order_detail.order,
        {
            eager: true
        }
    )
    order_detail: OrderDetail[];

    @Column({ type: 'simple-enum', enum: OrderStatus, default: OrderStatus.PENDING })
    @Index()
    status: string;

    @Column("date")
    @Index()
    date: string;

    @Column({ type: "int", default: 0 })
    subtotal: number;

    @Column("boolean", { default: true, select: false })
    is_active: boolean;

}
