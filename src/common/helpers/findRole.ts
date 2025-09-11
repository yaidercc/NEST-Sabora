import { BadRequestException } from "@nestjs/common";
import { GeneralRole } from "src/user/entities/general_role.entity";
import { Repository } from "typeorm";
import { validate as isUUID } from "uuid"

export const findGeneralRole = async (term: string, generalRoleRepository: Repository<GeneralRole>) => {
    let role: GeneralRole | null = null;
    if (isUUID(term)) role = await generalRoleRepository.findOneBy({ id: term })
    else role = await generalRoleRepository.findOneBy({ name: term })

    if (!role) {
        throw new BadRequestException("general role not found")
    }

    return role
}
