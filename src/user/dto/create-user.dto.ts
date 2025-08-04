import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        example: "Jhon Doe",
        description: "User fullname"
    })
    @IsString()
    full_name: string;

    @ApiProperty({
        example: "JhonDoe",
        description: "Username"
    })
    @IsString()
    username: string;

    @ApiProperty({
        example: "user@gmail.com",
        description: "User email"
    })
    @IsString()
    @IsEmail()
    email: string;
    @ApiProperty({
        example: "user123",
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
        example: "57356251432",
        description: "User phone"
    })
    @IsString()
    @IsPhoneNumber("CO")
    phone: string;

}
