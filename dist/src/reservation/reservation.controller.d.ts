import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { User } from 'src/user/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
export declare class ReservationController {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    create(createReservationDto: CreateReservationDto): Promise<Reservation | undefined>;
    findOne(id: string, user: User): Promise<Reservation | undefined>;
    changeReservationStatus(id: string, updateReservationDto: UpdateReservationDto, user: User): Promise<Reservation | undefined>;
}
