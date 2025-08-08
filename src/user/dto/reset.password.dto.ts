import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class RequestTempPasswordDto {

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'email must not be empty' })
    email: string;

    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsNotEmpty({ message: 'username must not be empty' })
    username: string;

}

export class NewPassword {

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    repeatPassword: string;

}

