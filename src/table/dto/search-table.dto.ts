import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsPositive, IsString, ValidateIf } from "class-validator";

export class SearchTableDto {
    @ApiProperty({
        description: "Table capacity",
        example: 3
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsNumber()
    @IsInt()
    @IsPositive()
    capacity: number;
}