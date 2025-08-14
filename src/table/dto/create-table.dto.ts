import { ApiProperty } from "@nestjs/swagger";
import { IsString, ValidateIf } from "class-validator";

export class CreateTableDto {

    @ApiProperty({
        description: "Table capacity",
        example: "3"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    capacity: string;

    @ApiProperty({
        description: "Table name",
        example: "Table 201"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    name: string;
}
