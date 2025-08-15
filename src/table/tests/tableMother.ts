import { CreateTableDto } from "../dto/create-table.dto";
import { TableService } from "../table.service";
import { Table } from "../entities/table.entity";

export class TableMother {
    static dto(tableInfo?: Partial<CreateTableDto>): CreateTableDto {
        return {
            name: tableInfo?.name ?? "100",
            capacity: tableInfo?.capacity ?? "10"
        }
    }


    static async createManyTables(tableService: TableService, quantity: number): Promise<Table[]> {
        let tables: Table[] = [];
        let roomsNames = new Set()

        while (roomsNames.size < quantity) {
            const randomNumber = Math.floor(Math.random() * (999 - 5 + 1)) + 5;
            roomsNames.add(String(randomNumber).padStart(3, "0"))
        }

        for (let j = 0; j < quantity; j++) {
            const employee = await tableService.create(TableMother.dto({
                name: `Table ${Array.from(roomsNames)[j]}`,
                capacity: `${Math.floor(Math.random() * 12) + 1}`
            }))
            if (employee) {
                tables.push(employee)
            }
        }
        return tables
    }

}
