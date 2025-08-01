import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    full_name: string;

    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;


    @IsString()
    @IsPhoneNumber("CO")
    phone: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @IsString()
    @IsUUID()
    role?: string;
}
