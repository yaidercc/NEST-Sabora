import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchTableDto } from './dto/search-table.dto';
export declare class TableService {
    private readonly tableRepository;
    private readonly logger;
    constructor(tableRepository: Repository<Table>);
    create(createTableDto: CreateTableDto): Promise<Table | undefined>;
    findAll(paginationDTO: PaginationDto): Promise<Table[]>;
    findTablesByCapacity(paginationDTO: PaginationDto, searchTableDto: SearchTableDto): Promise<Table[]>;
    findOne(term: string): Promise<Table | undefined>;
    update(id: string, updateTableDto: UpdateTableDto): Promise<Table | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
}
