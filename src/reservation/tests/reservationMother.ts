

import { CreateReservationDto } from "../dto/create-reservation.dto";
import { Reservation } from "../entities/reservation.entity";
import { ReservationService } from "../reservation.service";

export class ReservationMother {
    static dto(reservationInfo?: Partial<CreateReservationDto>): CreateReservationDto {
        return {
            user_id: reservationInfo?.user_id ?? "22260e72-1ec9-41dc-8799-146b96ef3d8c",
            table_id: reservationInfo?.table_id ?? "b19521ba-aa29-4af1-8127-2dbd33aee5cb",
            date: reservationInfo?.date ?? "2020-12-12",
            time_start: reservationInfo?.time_start ?? "13:00",
            party_size: reservationInfo?.party_size ?? 2,
        }
    }

    // static async createManyReservations(tableService: ReservationService, quantity: number): Promise<Reservation[]> {
        // let tables: Table[] = [];
        // let roomsNames = new Set()

        // while (roomsNames.size < quantity) {
        //     const randomNumber = Math.floor(Math.random() * (999 - 5 + 1)) + 5;
        //     roomsNames.add(String(randomNumber).padStart(3, "0"))
        // }

        // for (let j = 0; j < quantity; j++) {
        //     const employee = await tableService.create(ReservationMother.dto({
        //         name: `Table ${Array.from(roomsNames)[j]}`,
        //         capacity: `${Math.floor(Math.random() * 12) + 1}`
        //     }))
        //     if (employee) {
        //         tables.push(employee)
        //     }
        // }
        // return tables
    // }

}
