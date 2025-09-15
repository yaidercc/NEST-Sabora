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
exports.MenuItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const menu_item_entity_1 = require("./entities/menu_item.entity");
const typeorm_2 = require("typeorm");
const handleErrors_1 = require("../common/helpers/handleErrors");
const validateExistence_1 = require("../common/helpers/validateExistence");
const uuid_1 = require("uuid");
const isActive_1 = require("../common/helpers/isActive");
const upload_service_1 = require("../common/services/upload.service");
let MenuItemService = class MenuItemService {
    menuItemRepository;
    uploadsService;
    logger = new common_1.Logger("MenuItemService");
    constructor(menuItemRepository, uploadsService) {
        this.menuItemRepository = menuItemRepository;
        this.uploadsService = uploadsService;
    }
    async create(createMenuItemDto, file) {
        try {
            const existsMenuItem = await (0, validateExistence_1.validateExistence)(this.menuItemRepository, {
                name: createMenuItemDto.name.trim().toLowerCase()
            });
            if (!existsMenuItem)
                throw new common_1.ConflictException(`Menu item already exits`);
            const image = await this.uploadsService.create(file);
            const menuItem = this.menuItemRepository.create({
                ...createMenuItemDto,
                name: createMenuItemDto.name.trim().toLowerCase(),
                image
            });
            await this.menuItemRepository.save(menuItem);
            return menuItem;
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async findAll(paginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        return await this.menuItemRepository.find({
            take: limit,
            skip: offset,
            where: {
                is_active: true
            }
        });
    }
    async findOne(term) {
        let menuItem = null;
        if ((0, uuid_1.validate)(term))
            menuItem = await this.menuItemRepository.findOneBy({ id: term });
        else
            menuItem = await this.menuItemRepository.findOneBy({ name: term.trim().toLowerCase() });
        if (!menuItem)
            throw new common_1.NotFoundException(`Menu item not found ${term}`);
        const is_active = await (0, isActive_1.isActive)(menuItem.id, this.menuItemRepository);
        if (!is_active) {
            throw new common_1.BadRequestException("Menu item is not available");
        }
        return menuItem;
    }
    async update(id, updateMenuItemDto, file) {
        try {
            if (!updateMenuItemDto && !file)
                throw new common_1.BadRequestException("you must provide a file or data to update");
            let menuItem = await this.findOne(id);
            if (updateMenuItemDto) {
                if (updateMenuItemDto?.name)
                    updateMenuItemDto.name = updateMenuItemDto.name.trim().toLowerCase();
                menuItem = {
                    ...menuItem,
                    ...updateMenuItemDto
                };
            }
            if (file) {
                const image = await this.uploadsService.create(file);
                menuItem.image = image;
            }
            await this.menuItemRepository.update(id, menuItem);
            return await this.findOne(id);
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            return await this.menuItemRepository.update(id, { is_active: false });
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
};
exports.MenuItemService = MenuItemService;
exports.MenuItemService = MenuItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService])
], MenuItemService);
//# sourceMappingURL=menu_item.service.js.map