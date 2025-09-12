import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("order_detail")
export class OrderDetail {

    @ApiProperty({
        description: "Order details id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: "Order details quantity",
        example: 2
    })
    @Column("int")
    quantity: number;

    @ApiProperty({
        description: "Menu item",
        type: ()=> MenuItem
    })
    @ManyToOne(
        () => MenuItem,
        menu_item => menu_item.order_detail,
        {
            eager: true
        }
    )
    @JoinColumn({ name: 'menu_item_id' })
    menu_item: MenuItem;

    
    @ManyToOne(
        () => Order,
        order => order.order_details
    )
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column("boolean", { default: true, select: false })
    is_active: boolean;
}