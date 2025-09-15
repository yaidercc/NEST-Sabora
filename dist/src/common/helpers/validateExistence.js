"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExistence = void 0;
const validateExistence = async (repository, query) => {
    const record = await repository.find({
        where: query
    });
    return record ? true : false;
};
exports.validateExistence = validateExistence;
//# sourceMappingURL=validateExistence.js.map