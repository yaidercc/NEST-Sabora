import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { GeneralRole } from "../entities/general_role.entity";
import { initialData } from "src/seed/data/seed-data";

export class UserMother {
    static dto(): CreateUserDto {
        return {
            full_name: "yaider cordoba cordoba",
            email: "yaider@gmail.com",
            password: "cordobac123",
            phone: "573165482746"
        }
    }

    static async seedRoles(generalRoleRepository: Repository<GeneralRole>) {
        const generalRoles = initialData.generalRoles.map((item) => generalRoleRepository.create(item))
        await generalRoleRepository.save(generalRoles)
        return generalRoles[0]
    }
}