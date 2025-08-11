import { IsISO8601, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateEmployeeDto {

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    user_id: string;

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    employee_role_id: string;

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsISO8601()
    hiring_date: string;
}
