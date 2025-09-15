"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTableDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_table_dto_1 = require("./create-table.dto");
class UpdateTableDto extends (0, swagger_1.PartialType)(create_table_dto_1.CreateTableDto) {
}
exports.UpdateTableDto = UpdateTableDto;
//# sourceMappingURL=update-table.dto.js.map