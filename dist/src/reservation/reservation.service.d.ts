import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from './entities/schedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Table } from 'src/table/entities/table.entity';
export declare class ReservationService {
    private readonly reservationRepository;
    private readonly scheduleRepository;
    private readonly tableRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(reservationRepository: Repository<Reservation>, scheduleRepository: Repository<Schedule>, tableRepository: Repository<Table>, dataSource: DataSource);
    create(createReservationDto: CreateReservationDto): Promise<Reservation | undefined>;
    findOne(id: string, user: User): Promise<Reservation | undefined>;
    changeReservationStatus(id: string, updateReservationDto: UpdateReservationDto, user: User): Promise<Reservation | undefined>;
    private validatePermissions;
    private validateAvailability;
    private validateScheduleAvailability;
    private validateUserReservations;
    private validateTableAvailability;
}
