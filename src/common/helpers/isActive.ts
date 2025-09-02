
export const isActive = async (id: string, repository: any) => {

    const isActive =
        await repository
            .createQueryBuilder()
            .select("is_active")
            .where("id=:id", { id })
            .getRawOne()
    // getOne() is not useful in this case 'cause i need just one attr not the whole entity
    return isActive?.is_active
}