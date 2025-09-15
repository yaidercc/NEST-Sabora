import { CreateReservationDto } from "../dto/create-reservation.dto";
import { Reservation } from "../entities/reservation.entity";
import { ReservationService } from "../reservation.service";
import { UserService } from "src/user/user.service";
import { TableService } from "src/table/table.service";
export declare class ReservationMother {
    static dto(reservationInfo?: Partial<CreateReservationDto>): CreateReservationDto;
    static createManyReservations(reservationService: ReservationService, userService: UserService, tableService: TableService, quantity: number): Promise<Reservation[]>;
}
