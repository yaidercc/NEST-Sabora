"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMenuItemDto = void 0;
const class_validator_1 = require("class-validator");
const menu_item_type_1 = require("../enum/menu_item_type");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateMenuItemDto {
    name;
    description;
    price;
    menu_item_type;
}
exports.CreateMenuItemDto = CreateMenuItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item name",
        example: "Sancocho"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item description",
        example: "Delicioso sancocho tradicional colombiano"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item price",
        example: 25000
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMenuItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item type",
        example: menu_item_type_1.MenuItemType.MAIN_COURSE
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.values(menu_item_type_1.MenuItemType)),
    __metadata("design:type", String)
], CreateMenuItemDto.prototype, "menu_item_type", void 0);
//# sourceMappingURL=create-menu_item.dto.js.map