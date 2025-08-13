import { NotFoundException } from "@nestjs/common"

export const isActive = async (id: string, repository: any) => {
    const isActive =
        await repository
            .createQueryBuilder()
            .select("is_active")
            .where("id=:id", { id })
            .getRawOne()
    // getOne() is not useful in this case 'cause i need just one attr not the whole entity

    if (!isActive?.is_active) throw new NotFoundException("User is inactive talk with the admin")
}