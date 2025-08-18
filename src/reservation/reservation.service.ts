import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DataSource, In, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { handleException } from 'src/common/handleErrors';
import { User } from 'src/user/entities/user.entity';
import { Table } from 'src/table/entities/table.entity';
import * as dayjs from "dayjs"
import { Status } from './enum/status';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';

interface validateAvailabilityinterface { date: string, time: string, user_id: string, table_id: string, party_size: number }

@Injectable()
export class ReservationService {
  private readonly logger = new Logger("ReservationService")
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly dataSource: DataSource

  ) { }
  async create(createReservationDto: CreateReservationDto) {
    const { user_id, table_id, ...restReservationInfo } = createReservationDto
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect()
      queryRunner.startTransaction()

      const user = await queryRunner.manager.findOne(User, {
        where: {
          id: user_id,
          is_active: true
        }
      })
      if (!user) throw new NotFoundException("User not found or is not available")

      const table = await queryRunner.manager.findOne(Table, {
        where: {
          id: table_id,
          is_active: true
        }
      })
      if (!table) throw new NotFoundException("Table not found or is not available")


      const reservationDataToValidate: validateAvailabilityinterface = {
        date: restReservationInfo.date,
        time: restReservationInfo.time_start,
        user_id,
        table_id,
        party_size: restReservationInfo.party_size
      }

      await this.validateAvailability(reservationDataToValidate)

      const reservation = queryRunner.manager.create(Reservation, {
        ...restReservationInfo,
        time_end: dayjs(`${restReservationInfo.date} ${restReservationInfo.time_start}`).add(2, "hours").format("HH:mm:ss"),
        user,
        table,
        status: Status.CONFIRMED
      })

      await queryRunner.manager.save(Reservation, reservation);

      await queryRunner.commitTransaction();

      return reservation

    } catch (error) {
      await queryRunner.rollbackTransaction()
      handleException(error, this.logger)
    } finally {
      await queryRunner.release()
    }
  }

  async findOne(id: string, user: User) {
    try {
      const reservation = await this.reservationRepository.findOneBy({ id })

      if (!reservation) throw new NotFoundException("Reservation not found")

      const isOwner = user.id === reservation.user.id;
      const isAdmin = user.role.name === GeneralRoles.ADMIN;
      const isManager = user.employee?.employee_role.name === EmployeeRoles.MANAGER;

      if (!isOwner && !isAdmin && !isManager) {
        throw new ForbiddenException("You have no permission to perform this action");
      }

      return reservation;
    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async changeReservationStatus(id: string, updateReservationDto: UpdateReservationDto, user: User) {
    const { status } = updateReservationDto;

    try {
      const reservation = await this.reservationRepository.createQueryBuilder("reservation")
        .leftJoinAndSelect("reservation.user", "user")
        .where("reservation.id = :id", { id })
        .getOne();

      if (!reservation) throw new NotFoundException("Reservation not found");


      this.validatePermissions(status, user, reservation);

      reservation.status = status;
      await this.reservationRepository.save(reservation);

      return reservation;
    } catch (error) {
      handleException(error, this.logger);
    }
  }

  private validatePermissions(status: string, user: User, reservation: Reservation) {
    if (status === Status.CANCELLED) {
      const isOwner = user.id === reservation.user.id;
      const isAdmin = user.role.name === GeneralRoles.ADMIN;
      const isManager = user.employee?.employee_role.name === EmployeeRoles.MANAGER;

      if (!isOwner && !isAdmin && !isManager) {
        throw new ForbiddenException("You have no permission to perform this action");
      }
    }

    if ([Status.SEATED.valueOf(), Status.FINISHED.valueOf(), Status.NO_SHOW.valueOf()].includes(status)) {
      if(user.role.name === GeneralRoles.ADMIN) return;
      
      if (!user.employee) {
        throw new ForbiddenException("You have no permission to perform this action");
      }

      const allowedRoles = [EmployeeRoles.MANAGER.valueOf(), EmployeeRoles.WAITRESS.valueOf()];
      if (!allowedRoles.includes(user.employee.employee_role.name)) {
        throw new ForbiddenException("You have no permission to perform this action");
      }
    }
  }

  private async validateAvailability(reservationDataToValidate: validateAvailabilityinterface) {
    const { date, time, user_id, table_id, party_size } = reservationDataToValidate

    const reservationStart = dayjs(`${date} ${time}`);

    const isScheduleAvailable = await this.validateScheduleAvailability(reservationStart)
    if (!isScheduleAvailable.isAvailable) {
      throw new BadRequestException(isScheduleAvailable.error)
    }

    const canUserMakeAReservation = await this.validateUserReservations(reservationStart, user_id)
    if (!canUserMakeAReservation.canMakeAreservation) {
      throw new BadRequestException(canUserMakeAReservation.error)
    }

    const isTableAvailable = await this.validateTableAvailability(table_id, reservationStart, party_size)
    if (!isTableAvailable.isTableAvailable) {
      throw new BadRequestException(isTableAvailable.error)
    }

    return true;

  }

  private async validateScheduleAvailability(reservationDate: dayjs.Dayjs): Promise<{ isAvailable: boolean, error?: string }> {

    const reservationDay = reservationDate.get("d");
    const schedule = await this.scheduleRepository.findOneBy({ day_of_week: reservationDay })

    if (!schedule) {
      return {
        isAvailable: false,
        error: "The restaurant schedule not configured for this day"
      }
    }

    if (schedule?.is_closed) {
      return {
        isAvailable: false,
        error: "The resataurant is closed on the selected date."
      }
    }

    const reservationTime = reservationDate.format('HH:mm:ss');
    const lastAvailableReservationTime = dayjs(`${reservationDate.format("YYYY-MM-DD")} ${schedule?.closing_time}`).subtract(2, "hours").format("HH:mm:ss")
    const openingTime = schedule.opening_time!.substring(0, 5);

    if (reservationTime > lastAvailableReservationTime || reservationTime < openingTime) {
      return {
        isAvailable: false,
        error: `The resataurant schedule on the selected day is: ${schedule?.opening_time} to ${schedule?.closing_time}`
      }
    }

    return {
      isAvailable: true
    }
  }

  private async validateUserReservations(reservationDate: dayjs.Dayjs, user_id: string): Promise<{ canMakeAreservation: boolean, error?: string }> {

    const userReservations = await this.reservationRepository.createQueryBuilder("reservation")
      .leftJoin("reservation.user", "user")
      .where("user.id = :user_id", { user_id })
      .andWhere("reservation.date = :date", { date: reservationDate.format("YYYY-MM-DD") })
      .getCount()
    if (userReservations === 3) {
      return {
        canMakeAreservation: false,
        error: "Maximun 3 reservations per day allowed"
      }
    }

    return {
      canMakeAreservation: true
    }
  }

  private async validateTableAvailability(table_id: string, reservationStart: dayjs.Dayjs, party_size: number): Promise<{ isTableAvailable: boolean, error?: string }> {
    const tableCapacity = await this.tableRepository.findOne({
      where: {
        id: table_id,
        is_active: true,
      },
      select: { capacity: true }
    })

    if (+tableCapacity?.capacity! < party_size) {
      return {
        isTableAvailable: false,
        error: "Table capacity is not enough for your party size"
      }
    }

    const reservationEnd = reservationStart.add(2, "hours")

    const query = this.reservationRepository.createQueryBuilder("reservation")
      .leftJoin("reservation.table", "table")
      .where("table.id = :table_id", { table_id })
      .andWhere("reservation.date = :date", { date: reservationStart.format("YYYY-MM-DD") })
      .andWhere("reservation.status In (:...statuses)", {
        statuses: [Status.CONFIRMED, Status.SEATED]
      })

    if (this.dataSource.options?.type === "sqlite") {
      query.andWhere(
        `"reservation"."time_start" < :endTime
     AND TIME("reservation"."time_start", '+2 hours') > :startTime`,
        {
          startTime: reservationStart.format("HH:mm:ss"),
          endTime: reservationEnd.format('HH:mm:ss'),
          duration: 2
        }
      );
    } else {
      query.andWhere(
        `"reservation"."time_start" < :endTime
     AND "reservation"."time_start" + interval '2 hour' > :startTime`,
        {
          startTime: reservationStart.format("HH:mm:ss"),
          endTime: reservationEnd.format('HH:mm:ss'),
          duration: 2
        }
      )
    }

    const conflictReservations = await query.getMany()
    if (conflictReservations.length > 0) {
      return {
        isTableAvailable: false,
        error: "The selected table is not available at the selected time and date"
      }
    }

    return {
      isTableAvailable: true,
    }
  }

}

