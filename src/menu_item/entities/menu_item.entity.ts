import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { MenuItemType } from "../enum/menu_item_type";

@Entity("menu_item")
export class MenuItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 50, unique: true })
    name: string;

    @Column("text")
    description: string;

    @Column({ type: "int" })
    @Index()
    price: number;

    @Column({ type: "simple-enum", enum: MenuItemType })
    @Index()
    menu_item_type: string;

    @Column("text")
    image: string;

    @Column("boolean", { default: true, select: false })
    is_active: boolean;
}
