import { CreateUserDto } from "../dto/create-user.dto";

export class UserMother {
    static dto(): CreateUserDto {
        return {
            full_name: "yaider cordoba cordoba",
            email: "yaider@gmail.com",
            password: "cordobac123",
            phone: "573165482746",
            role: "e67b9a68-ba74-4aca-9854-8f1873ec1234"
        }
    }
}