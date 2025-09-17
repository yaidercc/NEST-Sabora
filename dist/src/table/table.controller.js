"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableController = void 0;
const common_1 = require("@nestjs/common");
const table_service_1 = require("./table.service");
const create_table_dto_1 = require("./dto/create-table.dto");
const update_table_dto_1 = require("./dto/update-table.dto");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const auth_decorator_1 = require("../user/decorators/auth.decorator");
const roles_1 = require("../common/enums/roles");
const swagger_1 = require("@nestjs/swagger");
const table_entity_1 = require("./entities/table.entity");
const search_table_dto_1 = require("./dto/search-table.dto");
let TableController = class TableController {
    tableService;
    constructor(tableService) {
        this.tableService = tableService;
    }
    create(createTableDto) {
        return this.tableService.create(createTableDto);
    }
    findByCapacity(paginationDTO, searchTableDto) {
        return this.tableService.findTablesByCapacity(paginationDTO, searchTableDto);
    }
    findAll(paginationDTO) {
        return this.tableService.findAll(paginationDTO);
    }
    findOne(id) {
        return this.tableService.findOne(id);
    }
    update(id, updateTableDto) {
        return this.tableService.update(id, updateTableDto);
    }
    remove(id) {
        return this.tableService.remove(id);
    }
};
exports.TableController = TableController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a table" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "table was created", type: table_entity_1.Table }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "User not found/Unauthorized" }),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN]),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_table_dto_1.CreateTableDto]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find tables by capacity" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Tables", type: [table_entity_1.Table] }),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN]),
    (0, common_1.Post)("find-by-capacity"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, search_table_dto_1.SearchTableDto]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "findByCapacity", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all tables" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Tables", type: [table_entity_1.Table] }),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find one table by a search term" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Table", type: table_entity_1.Table }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Table is not available" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Table not found" }),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update a table" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Table updated successfully", type: table_entity_1.Table }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Table is not available" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Table not found" }),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN]),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_table_dto_1.UpdateTableDto]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete a table" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Table deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Table not found" }),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN]),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableController.prototype, "remove", null);
exports.TableController = TableController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('table'),
    __metadata("design:paramtypes", [table_service_1.TableService])
], TableController);
//# sourceMappingURL=table.controller.js.map