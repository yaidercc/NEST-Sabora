"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationMother = void 0;
const userMother_1 = require("../../user/tests/userMother");
const tableMother_1 = require("../../table/tests/tableMother");
class ReservationMother {
    static dto(reservationInfo) {
        return {
            user_id: reservationInfo?.user_id ?? "22260e72-1ec9-41dc-8799-146b96ef3d8c",
            table_id: reservationInfo?.table_id ?? "b19521ba-aa29-4af1-8127-2dbd33aee5cb",
            date: reservationInfo?.date ?? "2020-12-12",
            time_start: reservationInfo?.time_start ?? "13:00:00",
            party_size: reservationInfo?.party_size ?? 3,
        };
    }
    static async createManyReservations(reservationService, userService, tableService, quantity) {
        let reservations = [];
        const users = await userMother_1.UserMother.createManyUsers(userService, quantity);
        const tables = await tableMother_1.TableMother.createManyTables(tableService, quantity, 3);
        for (let j = 0; j < quantity; j++) {
            const reservation = await reservationService.create(ReservationMother.dto({
                user_id: users[0].user.id,
                table_id: tables[0].id
            }));
            if (reservation) {
                reservations.push(reservation);
            }
        }
        return reservations;
    }
}
exports.ReservationMother = ReservationMother;
//# sourceMappingURL=reservationMother.js.map