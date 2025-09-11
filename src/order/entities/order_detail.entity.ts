import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order_status";
import { Order } from "./order.entity";

@Entity("order_detail")
export class OrderDetail {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("int")
    quantity: number;

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