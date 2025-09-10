import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order_status";
import { Order } from "./order.entity";

@Entity("order_detail")
export class OrderDetail {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("int")
    quantity: number;

    @Column({ type: 'simple-enum', enum: OrderStatus, default: OrderStatus.PENDING })
    @Index()
    status: string;

    @ManyToOne(
        () => MenuItem,
        menu_item => menu_item.order_detail,
        {
            eager: true
        }
    )
    menu_item: MenuItem;

    @ManyToOne(
        () => Order,
        order => order.order_details
    )
    order: Order;
    
    @Column("boolean", { default: true, select: false })
    is_active: boolean;
}