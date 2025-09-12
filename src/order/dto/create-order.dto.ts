import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsUUID, ValidateIf, ValidateNested } from "class-validator";


export class CreateOrderDetailDto {
    @ApiProperty({
        description: "Order detail quantity",
        example: 2
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @IsPositive()
    @IsInt()
    quantity: number;

    @ApiProperty({
        description: "Order detail id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"

    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsUUID()
    menu_item: string;
}

export class CreateOrderDto {
    @ApiProperty({
        description: "Table id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"

    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsUUID()
    table: string;

    @ApiProperty({
        description: "Customer id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @IsOptional()
    @IsUUID()
    customer?: string;

    @ApiProperty({
        description: "Is a order made by a customer",
        example: true
    })
    @IsBoolean()
    is_customer_order: boolean;

    @ApiProperty({
        description: "Order details",
        type: [CreateOrderDetailDto]
    })
    @IsArray()
    @ValidateNested({ each: true }) // validate if each atribute meets the validations
    @Type(() => CreateOrderDetailDto) // converts the json object into a CreateOrderDetailDto so nest can validate
    order_details: CreateOrderDetailDto[];

}