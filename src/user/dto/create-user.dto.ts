import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        example: "Jhon Doe",
        description: "User fullname"
    })
    @ValidateIf((value) => value !== null && value !== undefined )
    @IsString()
    @IsNotEmpty({ message: 'full_name must not be empty' })
    full_name: string;

    @ApiProperty({
        example: "JhonDoe",
        description: "Username"
    })
    @ValidateIf((value) => value !== null && value !== undefined )
    @IsString()
    @IsNotEmpty({ message: 'username must not be empty' })
    username: string; 

    @ApiProperty({
        example: "user@gmail.com",
        description: "User email"
    })
    @ValidateIf((value) => value !== null && value !== undefined )
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'email must not be empty' })
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
    @ValidateIf((value) => value !== null && value !== undefined )
    @IsString()
    @IsPhoneNumber("CO")
    @IsNotEmpty({ message: 'phone must not be empty' })
    phone: string;

}
