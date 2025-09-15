"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMenuItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_menu_item_dto_1 = require("./create-menu_item.dto");
class UpdateMenuItemDto extends (0, swagger_1.PartialType)(create_menu_item_dto_1.CreateMenuItemDto) {
}
exports.UpdateMenuItemDto = UpdateMenuItemDto;
//# sourceMappingURL=update-menu_item.dto.js.map