import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserLogin {
    @ApiProperty({
        example: User,
        description: "User info"
    })
    user: User;
    @ApiProperty({
        example: "eyJhbGciOiJIUzI1NiIsInR...",
        description: "User token"
    })
    token: string;
}