import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsPositive, IsString, IsUUID, ValidateIf, ValidateNested } from "class-validator";


export class CreateOrderDetailDto {
    @ValidateIf((value) => value !== null && value !== undefined)
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    menu_item: string;
}

export class CreateOrderDto {
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    table: string;

    @IsArray()
    @ValidateNested({ each: true }) // validate if each atribute meets the validations
    @Type(() => CreateOrderDetailDto) // converts the json object into a CreateOrderDetailDto so nest can validate
    order_details: CreateOrderDetailDto[];

}