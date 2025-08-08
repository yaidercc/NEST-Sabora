import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class RequestTempPasswordDto {

    @ApiProperty({
        example: "user@gmail.com",
        description: "User email"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'email must not be empty' })
    email: string;

    @ApiProperty({
        example: "JhonDoe",
        description: "Username"
    })
    @ValidateIf((value) => value !== null && value !== undefined)
    @IsString()
    @IsNotEmpty({ message: 'username must not be empty' })
    username: string;

}

export class NewPassword {

    @ApiProperty({
        example: "user123*",
        description: "User password"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        example: "user123*",
        description: "User password"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    repeatPassword: string;

}

