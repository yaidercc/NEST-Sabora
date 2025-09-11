import { IsIn, IsString, ValidateIf } from "class-validator";
import { OrderStatus } from "../enum/order_status";


export class ChangeOrderStatus {
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsIn(Object.values(OrderStatus))
    status: string;
}
