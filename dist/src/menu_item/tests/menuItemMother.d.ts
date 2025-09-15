import { CreateMenuItemDto } from "../dto/create-menu_item.dto";
import { MenuItem } from "../entities/menu_item.entity";
import { MenuItemService } from "../menu_item.service";
export declare class MenuItemMother {
    static dto(menuItemInfo?: Partial<CreateMenuItemDto>): CreateMenuItemDto;
    static createManyMenuItems(menuItemService: MenuItemService, quantity: number): Promise<MenuItem[]>;
}
