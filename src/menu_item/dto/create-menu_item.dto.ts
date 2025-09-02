import { IsIn, IsInt, IsNumber, IsPositive, IsString, ValidateIf } from "class-validator";
import { MenuItemType } from "../enum/menu_item_type";
import { Transform } from "class-transformer";

export class CreateMenuItemDto {

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    name: string;

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    description: string;

    @ValidateIf((value) => value !== null && value !== undefined)
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @IsPositive()
    @IsInt()
    price: number;

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsIn(Object.values(MenuItemType))
    menu_item_type: string;
}
