import { Transform } from "class-transformer";
import { IsIn, IsNumber, IsPositive, IsString, IsUUID, ValidateIf } from "class-validator";
import { PaymentMethods } from "../enum/payment_methods";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInvoiceDto {

    @ApiProperty({
        description: "Order id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsUUID()
    order: string;

    @ApiProperty({
        description: "Service fee rate",
        example: 0.2
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    service_fee_rate: number

    @ApiProperty({
        description: "Payment method",
        enum: PaymentMethods
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsIn(Object.values(PaymentMethods))
    payment_method: string;
}
