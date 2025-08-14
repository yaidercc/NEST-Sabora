import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateEmployeeDto {

    @ApiProperty({
        description: "User id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    user_id: string;

    @ApiProperty({
        description: "Employee role id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    employee_role_id: string;

    @ApiProperty({
        description: "Hiring date",
        example: "2020-10-10"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsISO8601()
    hiring_date: string;
}
