"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemMother = void 0;
const menu_item_type_1 = require("../enum/menu_item_type");
const menuItem_mock_1 = require("./mocks/menuItem.mock");
const uuid_1 = require("uuid");
class MenuItemMother {
    static dto(menuItemInfo) {
        return {
            name: menuItemInfo?.name ?? "Sancocho",
            description: menuItemInfo?.description ?? "Delicioso sancocho tradicional colombiano",
            price: menuItemInfo?.price ?? 25000,
            menu_item_type: menuItemInfo?.menu_item_type ?? menu_item_type_1.MenuItemType.MAIN_COURSE
        };
    }
    static async createManyMenuItems(menuItemService, quantity) {
        const baseNames = ["Sancocho", "Arepa", "Bandeja", "Empanada", "Ajiaco"];
        let menuItems = [];
        for (let i = 0; i < quantity; i++) {
            const menuItemName = `${baseNames[Math.floor(Math.random() * baseNames.length)]}_${(0, uuid_1.v4)().split("-")[0]}`;
            const menuItem = await menuItemService.create(MenuItemMother.dto({
                name: menuItemName,
                description: `Delicioso ${menuItemName}`
            }), menuItem_mock_1.mockFile);
            if (menuItem) {
                menuItems.push(menuItem);
            }
        }
        return menuItems;
    }
}
exports.MenuItemMother = MenuItemMother;
//# sourceMappingURL=menuItemMother.js.map