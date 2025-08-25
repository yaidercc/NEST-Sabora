import { Repository, ObjectLiteral } from "typeorm";

export const validateExistence = async <T extends ObjectLiteral>(repository: Repository<T>, query: Partial<T>): Promise<boolean> => {
    const record = await repository.find({
        where: query
    });
    return record ? true : false
}