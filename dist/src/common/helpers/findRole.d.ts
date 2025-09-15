import { GeneralRole } from "src/user/entities/general_role.entity";
import { Repository } from "typeorm";
export declare const findGeneralRole: (term: string, generalRoleRepository: Repository<GeneralRole>) => Promise<GeneralRole>;
