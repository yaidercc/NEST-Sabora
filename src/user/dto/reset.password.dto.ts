import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class SendEmailDTO {

    @ValidateIf((value) => value !== null && value !== undefined )
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'email must not be empty' })
    email: string;

  
}
