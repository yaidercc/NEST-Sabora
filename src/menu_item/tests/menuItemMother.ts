import { CreateMenuItemDto } from "../dto/create-menu_item.dto";
import { MenuItem } from "../entities/menu_item.entity";
import { MenuItemType } from "../enum/menu_item_type";
import { MenuItemService } from "../menu_item.service";
import { mockFile } from "./mocks/menuItem.mock";

export class MenuItemMother {
    static dto(menuItemInfo?: Partial<CreateMenuItemDto>): CreateMenuItemDto {
        return {
            name: menuItemInfo?.name ?? "Sancocho",
            description: menuItemInfo?.description ?? "Delicioso sancocho tradicional colombiano",
            price: menuItemInfo?.price ?? 25000,
            menu_item_type: menuItemInfo?.menu_item_type ?? MenuItemType.MAIN_COURSE
        };
    }

    static async createManyMenuItems(menuItemService: MenuItemService, quantity: number): Promise<MenuItem[]> {
        const baseNames = ["Sancocho", "Arepa", "Bandeja", "Empanada", "Ajiaco"];
        let menuItems: MenuItem[] = [];

        for (let i = 0; i < quantity; i++) {
            const menuItemName = `${baseNames[Math.floor(Math.random() * baseNames.length)]}_${i}`
            const menuItem = await menuItemService.create(MenuItemMother.dto({
                name: menuItemName,
                description: `Delicioso ${menuItemName}`
            }), mockFile)
            if (menuItem) {
                menuItems.push(menuItem)
            }
        }
        return menuItems
    }

}
