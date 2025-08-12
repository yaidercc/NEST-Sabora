import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class PaginationDto {

    @ApiProperty({
        default: 10, description: "How many rows do you need"
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // enableImplicitConversions: true -> instead of set this option on main.ts we can set it here
    limit?: number;

    @ApiProperty({
        default: 0, description: "How many pages do you want to skip"
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number
}