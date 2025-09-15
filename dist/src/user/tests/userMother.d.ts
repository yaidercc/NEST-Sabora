import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { GeneralRole } from "../entities/general_role.entity";
import { User } from "../entities/user.entity";
import { UserService } from "../user.service";
export declare class UserMother {
    static dto(): CreateUserDto;
    static randomDTO(): CreateUserDto;
    static createManyUsers(userService: UserService, quantity: number): Promise<{
        user: Partial<User>;
        token: string;
    }[]>;
    static seedRoles(generalRoleRepository: Repository<GeneralRole>): Promise<GeneralRole>;
}
