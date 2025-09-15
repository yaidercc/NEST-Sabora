import { Repository, ObjectLiteral } from "typeorm";
export declare const validateExistence: <T extends ObjectLiteral>(repository: Repository<T>, query: Partial<T>) => Promise<boolean>;
