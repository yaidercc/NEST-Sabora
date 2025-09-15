"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableMother = void 0;
class TableMother {
    static dto(tableInfo) {
        return {
            name: tableInfo?.name ?? "100",
            capacity: tableInfo?.capacity ?? 10
        };
    }
    static async createManyTables(tableService, quantity, capacity) {
        let tables = [];
        let roomsNames = new Set();
        while (roomsNames.size < quantity) {
            const randomNumber = Math.floor(Math.random() * (999 - 5 + 1)) + 5;
            roomsNames.add(String(randomNumber).padStart(3, "0"));
        }
        for (let j = 0; j < quantity; j++) {
            const table = await tableService.create(TableMother.dto({
                name: `${Array.from(roomsNames)[j]}`,
                capacity: capacity || Math.floor(Math.random() * 12) + 1
            }));
            if (table) {
                tables.push(table);
            }
        }
        return tables;
    }
}
exports.TableMother = TableMother;
//# sourceMappingURL=tableMother.js.map