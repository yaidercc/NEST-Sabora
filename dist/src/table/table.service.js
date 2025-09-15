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
exports.TableService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const table_entity_1 = require("./entities/table.entity");
const handleErrors_1 = require("../common/helpers/handleErrors");
const uuid_1 = require("uuid");
const isActive_1 = require("../common/helpers/isActive");
let TableService = class TableService {
    tableRepository;
    logger = new common_1.Logger("TableService");
    constructor(tableRepository) {
        this.tableRepository = tableRepository;
    }
    async create(createTableDto) {
        try {
            const user = this.tableRepository.create(createTableDto);
            await this.tableRepository.save(user);
            return user;
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async findAll(paginationDTO) {
        const { limit = 10, offset = 0 } = paginationDTO;
        return this.tableRepository.find({
            take: limit,
            skip: offset,
            where: { is_active: true }
        });
    }
    async findTablesByCapacity(paginationDTO, searchTableDto) {
        const { limit = 10, offset = 0 } = paginationDTO;
        const { capacity = 2 } = searchTableDto;
        return this.tableRepository.find({
            take: limit,
            skip: offset,
            where: { is_active: true, capacity: (0, typeorm_2.MoreThanOrEqual)(capacity) }
        });
    }
    async findOne(term) {
        let table = null;
        try {
            if ((0, uuid_1.validate)(term))
                table = await this.tableRepository.findOneBy({ id: term });
            else {
                const queryBuilder = this.tableRepository.createQueryBuilder("table");
                table = await queryBuilder
                    .where("(LOWER(name) = :name", { term: term.toLowerCase() })
                    .getOne();
            }
            if (!table)
                throw new common_1.NotFoundException("Table not found");
            const is_active = await (0, isActive_1.isActive)(table.id, this.tableRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("Table is not available");
            }
            return table;
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async update(id, updateTableDto) {
        try {
            if (!updateTableDto || typeof updateTableDto !== 'object') {
                throw new common_1.BadRequestException("No data provided to update");
            }
            const table = await this.tableRepository.preload({
                id,
                ...updateTableDto
            });
            if (!table)
                throw new common_1.NotFoundException("Table not found");
            const is_active = await (0, isActive_1.isActive)(id, this.tableRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("Table is not available");
            }
            await this.tableRepository.save(table);
            return await this.findOne(id);
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async remove(id) {
        try {
            const table = await this.tableRepository.findOneBy({ id });
            if (!table)
                throw new common_1.NotFoundException("Table not found");
            const is_active = await (0, isActive_1.isActive)(id, this.tableRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("Table is not available");
            }
            return await this.tableRepository.update(id, { is_active: false });
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
};
exports.TableService = TableService;
exports.TableService = TableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TableService);
//# sourceMappingURL=table.service.js.map