import { IsIn, IsString, ValidateIf } from "class-validator";
import { OrderStatus } from "../enum/order_status";
import { ApiProperty } from "@nestjs/swagger";


export class ChangeOrderStatus {
    @ApiProperty({
        description: "Order status",
        enum: OrderStatus
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsIn(Object.values(OrderStatus))
    status: string;
}
