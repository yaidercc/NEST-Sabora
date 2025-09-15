"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGeneralRole = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const findGeneralRole = async (term, generalRoleRepository) => {
    let role = null;
    if ((0, uuid_1.validate)(term))
        role = await generalRoleRepository.findOneBy({ id: term });
    else
        role = await generalRoleRepository.findOneBy({ name: term });
    if (!role) {
        throw new common_1.BadRequestException("general role not found");
    }
    return role;
};
exports.findGeneralRole = findGeneralRole;
//# sourceMappingURL=findRole.js.map