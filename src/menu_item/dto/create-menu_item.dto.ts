import { IsIn, IsNumber, IsPositive, IsString, ValidateIf } from "class-validator";
import { MenuItemType } from "../enum/menu_item_type";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMenuItemDto {

    @ApiProperty({
        description: "Menu item name",
        example: "Sancocho"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    name: string;

    @ApiProperty({
        description: "Menu item description",
        example: "Delicioso sancocho tradicional colombiano"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    description: string;

    @ApiProperty({
        description: "Menu item price",
        example: 25000
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    price: number;

    @ApiProperty({
        description: "Menu item type",
        example: MenuItemType.MAIN_COURSE
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsIn(Object.values(MenuItemType))
    menu_item_type: string;
}
