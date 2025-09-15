"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleException = void 0;
const common_1 = require("@nestjs/common");
const handleException = (error, logger) => {
    if (error.code === '23505')
        throw new common_1.BadRequestException(error.detail);
    if (error.code === '23502')
        throw new common_1.BadRequestException(`The field ${JSON.stringify(error.column)} cannot be null or undefined`);
    if (error.code === '23503')
        throw new common_1.BadRequestException('There are still related records linked to this entry');
    logger.error(error);
    if (error instanceof common_1.HttpException) {
        throw error;
    }
    throw new common_1.InternalServerErrorException("Unexpected error! check server logs");
};
exports.handleException = handleException;
//# sourceMappingURL=handleErrors.js.map