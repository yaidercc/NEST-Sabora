import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MenuItemType } from "../enum/menu_item_type";
import { ApiProperty } from "@nestjs/swagger";
import { OrderDetail } from "src/order/entities/order_detail.entity";

@Entity("menu_item")
export class MenuItem {
    @ApiProperty({
        description: "Menu item id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        description: "Menu item name",
        example: "Sancocho"
    })
    @Column({ length: 50, unique: true })
    name: string;

    @ApiProperty({
        description: "Menu item description",
        example: "Delicioso sancocho tradicional colombiano"
    })
    @Column("text")
    description: string;

    @ApiProperty({
        description: "Menu item price",
        example: 25.000
    })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @Index()
    price: number;

    @ApiProperty({
        description: "Menu item type",
        example: MenuItemType.MAIN_COURSE
    })
    @Column({ type: "simple-enum", enum: MenuItemType })
    @Index()
    menu_item_type: string;

    @ApiProperty({
        description: "Menu item image",
        example: "https://image.com/image.jpg"
    })
    @Column("text")
    image: string;

    @Column("boolean", { default: true, select: false })
    is_active: boolean;

    @OneToMany(
        () => OrderDetail,
        order_detail => order_detail.menu_item
    )
    order_detail: OrderDetail;
}
