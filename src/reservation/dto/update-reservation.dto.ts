import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enum/status';
import { IsIn, IsString, ValidateIf } from 'class-validator';

export class UpdateReservationDto {
    @ApiProperty({
        description: "reservation status",
        example: Status.CONFIRMED
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsIn(Object.values(Status))
    status: string;
}
