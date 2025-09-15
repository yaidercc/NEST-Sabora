import { MenuItemService } from './menu_item.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MenuItem } from './entities/menu_item.entity';
export declare class MenuItemController {
    private readonly menuItemService;
    constructor(menuItemService: MenuItemService);
    create(createMenuItemDto: CreateMenuItemDto, file: Express.Multer.File): Promise<MenuItem | undefined>;
    findAll(paginationDto: PaginationDto): Promise<MenuItem[]>;
    findOne(term: string): Promise<MenuItem>;
    update(id: string, updateMenuItemDto?: UpdateMenuItemDto, file?: Express.Multer.File): Promise<MenuItem | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
}
