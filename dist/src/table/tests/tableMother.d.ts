import { CreateTableDto } from "../dto/create-table.dto";
import { TableService } from "../table.service";
import { Table } from "../entities/table.entity";
export declare class TableMother {
    static dto(tableInfo?: Partial<CreateTableDto>): CreateTableDto;
    static createManyTables(tableService: TableService, quantity: number, capacity?: number): Promise<Table[]>;
}
