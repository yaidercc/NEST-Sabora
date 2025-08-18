

import { UserMother } from "src/user/tests/userMother";
import { CreateReservationDto } from "../dto/create-reservation.dto";
import { Reservation } from "../entities/reservation.entity";
import { ReservationService } from "../reservation.service";
import { UserService } from "src/user/user.service";
import { TableService } from "src/table/table.service";
import { TableMother } from "src/table/tests/tableMother";

export class ReservationMother {
    static dto(reservationInfo?: Partial<CreateReservationDto>): CreateReservationDto {
        return {
            user_id: reservationInfo?.user_id ?? "22260e72-1ec9-41dc-8799-146b96ef3d8c",
            table_id: reservationInfo?.table_id ?? "b19521ba-aa29-4af1-8127-2dbd33aee5cb",
            date: reservationInfo?.date ?? "2020-12-12",
            time_start: reservationInfo?.time_start ?? "13:00:00",
            party_size: reservationInfo?.party_size ?? 3,
        }
    }

    static async createManyReservations(reservationService: ReservationService, userService: UserService, tableService: TableService, quantity: number): Promise<Reservation[]> {
        let reservations: Reservation[] = [];
        const users = await UserMother.createManyUsers(userService, quantity)
        const tables = await TableMother.createManyTables(tableService, quantity, 3)

        for (let j = 0; j < quantity; j++) {
            const reservation = await reservationService.create(ReservationMother.dto({
                user_id: users[0].user.id,
                table_id: tables[0].id
            }))
            if (reservation) {
                reservations.push(reservation)
            }
        }
        return reservations
    }

}
