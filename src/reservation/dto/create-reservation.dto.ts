import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsNumber, IsPositive, IsString, IsTimeZone, IsUUID, Matches, ValidateIf } from "class-validator";

export class CreateReservationDto {
    @ApiProperty({
        description: "User id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    user_id: string;

    @ApiProperty({
        description: "Table id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e559"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsUUID()
    table_id: string;

    @ApiProperty({
        description: "reservation date",
        example: "2020-10-10"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsISO8601()
    date: string;

    @ApiProperty({
        description: "reservation time start",
        example: "2020-10-10"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'Time must be in HH:mm:ss format'
    })
    time_start: string;

    @ApiProperty({
        description: "reservation party size",
        example: "2020-10-10"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsNumber()
    @IsPositive()
    @IsInt()
    party_size: number;
}
