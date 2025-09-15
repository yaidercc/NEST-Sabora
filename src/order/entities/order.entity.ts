import { Table } from "src/table/entities/table.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order_status";
import { OrderDetail } from "./order_detail.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("order")
export class Order {
    @ApiProperty({
        description: "Order id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: "User who made the order",
        type:()=>()=> User,
    })
    @ManyToOne(
        () => User,
        user => user.order,
        { eager: true }
    )
    @Index()
    user: User;

    @ApiProperty({
        description: "Customer for whom the order is intended",
        type:()=> User,
        required: false
    })
    @ManyToOne(
        () => User,
        { eager: true, nullable: true }
    )
    @Index()
    customer?: User;

    @ApiProperty({
        description: "Table where the order was placed",
        type:()=> Table
    })
    @ManyToOne(
        () => Table,
        table => table.order,
        { eager: true }
    )
    table: Table;

    @ApiProperty({
        description: "Order details",
        type:()=> OrderDetail
    })
    @OneToMany(
        () => OrderDetail,
        order_detail => order_detail.order,
        {
            eager: true,
            cascade: true
        }
    )
    order_details: OrderDetail[];

    @ApiProperty({
        description: "Order status",
        enum: OrderStatus
    })

    @Column({ type: 'simple-enum', enum: OrderStatus, default: OrderStatus.PENDING })
    @Index()
    status: string;

    @ApiProperty({
        description: "Is a order made by a customer",
        example: true
    })
    @Column("boolean")
    @Index()
    is_customer_order: boolean;

    @ApiProperty({
        description: "Order date",
        example: "2020-10-10"
    })
    @Column("date")
    @Index()
    date: string;

    @ApiProperty({
        description: "Order subtotal",
        example: 12.0000
    })
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    subtotal: number;

    @Column("boolean", { default: true, select: false })
    is_active: boolean;

}
