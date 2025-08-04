import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { GeneralRole } from "../entities/general_role.entity";
import { initialData } from "src/seed/data/seed-data";
import { User } from "../entities/user.entity";
import { UserService } from "../user.service";
import { Chance } from "chance"

export class UserMother {
    static dto(): CreateUserDto {
        return {
            full_name: "yaider cordoba cordoba",
            username: "yaidercc",
            email: "yaider@gmail.com",
            password: "cordobac123",
            phone: "573165482746"
        }
    }

    static randomDTO(): CreateUserDto {
        return {
            full_name: Chance().name(),
            username: Chance().name().split(" ")[0],
            email: Chance().email(),
            password: "cordobac123",
            phone: `573${Chance().integer({ min: 0, max: 9 })}${Chance().string({ length: 7, pool: '0123456789' })}`
        }
    }

    static async createManyUsers(userService: UserService, quantity: number): Promise<{ user: Partial<User>, token: string }[]> {
        const users: { user: Partial<User>, token: string }[] = []
        
        for (let i = 0; i < quantity; i++) {
            const user = await userService.create(UserMother.randomDTO())
            if (user) {
                users.push(user)
            }
        }

        return users
    }


    static async seedRoles(generalRoleRepository: Repository<GeneralRole>) {
        const generalRoles = initialData.generalRoles.map((item) => generalRoleRepository.create(item))
        await generalRoleRepository.save(generalRoles)
        return generalRoles[0]
    }

}
