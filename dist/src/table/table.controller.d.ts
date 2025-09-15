import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Table } from './entities/table.entity';
import { SearchTableDto } from './dto/search-table.dto';
export declare class TableController {
    private readonly tableService;
    constructor(tableService: TableService);
    create(createTableDto: CreateTableDto): Promise<Table | undefined>;
    findByCapacity(paginationDTO: PaginationDto, searchTableDto: SearchTableDto): Promise<Table[]>;
    findAll(paginationDTO: PaginationDto): Promise<Table[]>;
    findOne(id: string): Promise<Table | undefined>;
    update(id: string, updateTableDto: UpdateTableDto): Promise<Table | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
}
