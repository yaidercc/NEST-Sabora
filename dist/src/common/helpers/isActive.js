"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActive = void 0;
const isActive = async (id, repository) => {
    const isActive = await repository
        .createQueryBuilder()
        .select("is_active")
        .where("id=:id", { id })
        .getRawOne();
    return isActive?.is_active;
};
exports.isActive = isActive;
//# sourceMappingURL=isActive.js.map