import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { Status } from '../enum/status';
import { IsIn, IsString, ValidateIf } from 'class-validator';

export class UpdateReservationDto {
    @ApiProperty({
        description: "reservation status",
        example: Status.PENDING
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsIn(Object.values(Status))
    status: string;
}
