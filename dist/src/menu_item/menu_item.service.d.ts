import { PaginationDto } from './../common/dtos/pagination.dto';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItem } from './entities/menu_item.entity';
import { Repository } from 'typeorm';
import { UploadService } from 'src/common/services/upload.service';
export declare class MenuItemService {
    private readonly menuItemRepository;
    private readonly uploadsService;
    private readonly logger;
    constructor(menuItemRepository: Repository<MenuItem>, uploadsService: UploadService);
    create(createMenuItemDto: CreateMenuItemDto, file: Express.Multer.File): Promise<MenuItem | undefined>;
    findAll(paginationDto: PaginationDto): Promise<MenuItem[]>;
    findOne(term: string): Promise<MenuItem>;
    update(id: string, updateMenuItemDto?: UpdateMenuItemDto, file?: Express.Multer.File): Promise<MenuItem | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
}
