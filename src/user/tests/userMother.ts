import { CreateUserDto } from "../dto/create-user.dto";

export class UserMother {
    static dto(): CreateUserDto {
        return {
            full_name: "yaider cordoba cordoba",
            email: "yaider@gmail.com",
            password: "cordobac123",
            phone: "573165482746"
        }
    }
}