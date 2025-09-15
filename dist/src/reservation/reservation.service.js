"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const typeorm_2 = require("@nestjs/typeorm");
const schedule_entity_1 = require("./entities/schedule.entity");
const handleErrors_1 = require("../common/helpers/handleErrors");
const user_entity_1 = require("../user/entities/user.entity");
const table_entity_1 = require("../table/entities/table.entity");
const dayjs = require("dayjs");
const status_1 = require("./enum/status");
const roles_1 = require("../common/enums/roles");
let ReservationService = class ReservationService {
    reservationRepository;
    scheduleRepository;
    tableRepository;
    dataSource;
    logger = new common_1.Logger("ReservationService");
    constructor(reservationRepository, scheduleRepository, tableRepository, dataSource) {
        this.reservationRepository = reservationRepository;
        this.scheduleRepository = scheduleRepository;
        this.tableRepository = tableRepository;
        this.dataSource = dataSource;
    }
    async create(createReservationDto) {
        const { user_id, table_id, ...restReservationInfo } = createReservationDto;
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            queryRunner.startTransaction();
            const user = await queryRunner.manager.findOne(user_entity_1.User, {
                where: {
                    id: user_id,
                    is_active: true
                }
            });
            if (!user)
                throw new common_1.NotFoundException("User not found or is not available");
            const table = await queryRunner.manager.findOne(table_entity_1.Table, {
                where: {
                    id: table_id,
                    is_active: true
                }
            });
            if (!table)
                throw new common_1.NotFoundException("Table not found or is not available");
            const reservationDataToValidate = {
                date: restReservationInfo.date,
                time: restReservationInfo.time_start,
                user_id,
                table_id,
                party_size: restReservationInfo.party_size
            };
            await this.validateAvailability(reservationDataToValidate);
            const reservation = queryRunner.manager.create(reservation_entity_1.Reservation, {
                ...restReservationInfo,
                time_end: dayjs(`${restReservationInfo.date} ${restReservationInfo.time_start}`).add(2, "hours").format("HH:mm:ss"),
                user,
                table,
                status: status_1.Status.CONFIRMED
            });
            await queryRunner.manager.save(reservation_entity_1.Reservation, reservation);
            await queryRunner.commitTransaction();
            return reservation;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            (0, handleErrors_1.handleException)(error, this.logger);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findOne(id, user) {
        try {
            const reservation = await this.reservationRepository.findOneBy({ id });
            if (!reservation)
                throw new common_1.NotFoundException("Reservation not found");
            const isOwner = user.id === reservation.user.id;
            const isAdmin = user.role.name === roles_1.GeneralRoles.ADMIN;
            const isManager = user.employee?.employee_role.name === roles_1.EmployeeRoles.MANAGER;
            if (!isOwner && !isAdmin && !isManager) {
                throw new common_1.ForbiddenException("You have no permission to perform this action");
            }
            return reservation;
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async changeReservationStatus(id, updateReservationDto, user) {
        const { status } = updateReservationDto;
        try {
            const reservation = await this.reservationRepository.createQueryBuilder("reservation")
                .leftJoinAndSelect("reservation.user", "user")
                .where("reservation.id = :id", { id })
                .getOne();
            if (!reservation)
                throw new common_1.NotFoundException("Reservation not found");
            this.validatePermissions(status, user, reservation);
            reservation.status = status;
            await this.reservationRepository.save(reservation);
            return reservation;
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    validatePermissions(status, user, reservation) {
        if (status === status_1.Status.CANCELLED) {
            const isOwner = user.id === reservation.user.id;
            const isAdmin = user.role.name === roles_1.GeneralRoles.ADMIN;
            const isManager = user.employee?.employee_role.name === roles_1.EmployeeRoles.MANAGER;
            if (!isOwner && !isAdmin && !isManager) {
                throw new common_1.ForbiddenException("You have no permission to perform this action");
            }
        }
        if ([status_1.Status.SEATED.valueOf(), status_1.Status.FINISHED.valueOf(), status_1.Status.NO_SHOW.valueOf()].includes(status)) {
            if (user.role.name === roles_1.GeneralRoles.ADMIN)
                return;
            if (!user.employee) {
                throw new common_1.ForbiddenException("You have no permission to perform this action");
            }
            const allowedRoles = [roles_1.EmployeeRoles.MANAGER.valueOf(), roles_1.EmployeeRoles.WAITRESS.valueOf()];
            if (!allowedRoles.includes(user.employee.employee_role.name)) {
                throw new common_1.ForbiddenException("You have no permission to perform this action");
            }
        }
    }
    async validateAvailability(reservationDataToValidate) {
        const { date, time, user_id, table_id, party_size } = reservationDataToValidate;
        const reservationStart = dayjs(`${date} ${time}`);
        const isScheduleAvailable = await this.validateScheduleAvailability(reservationStart);
        if (!isScheduleAvailable.isAvailable) {
            throw new common_1.BadRequestException(isScheduleAvailable.error);
        }
        const canUserMakeAReservation = await this.validateUserReservations(reservationStart, user_id);
        if (!canUserMakeAReservation.canMakeAreservation) {
            throw new common_1.BadRequestException(canUserMakeAReservation.error);
        }
        const isTableAvailable = await this.validateTableAvailability(table_id, reservationStart, party_size);
        if (!isTableAvailable.isTableAvailable) {
            throw new common_1.BadRequestException(isTableAvailable.error);
        }
        return true;
    }
    async validateScheduleAvailability(reservationDate) {
        const reservationDay = reservationDate.get("d");
        const schedule = await this.scheduleRepository.findOneBy({ day_of_week: reservationDay });
        if (!schedule) {
            return {
                isAvailable: false,
                error: "The restaurant schedule not configured for this day"
            };
        }
        if (schedule?.is_closed) {
            return {
                isAvailable: false,
                error: "The resataurant is closed on the selected date."
            };
        }
        const reservationTime = reservationDate.format('HH:mm:ss');
        const lastAvailableReservationTime = dayjs(`${reservationDate.format("YYYY-MM-DD")} ${schedule?.closing_time}`).subtract(2, "hours").format("HH:mm:ss");
        const openingTime = schedule.opening_time.substring(0, 5);
        if (reservationTime > lastAvailableReservationTime || reservationTime < openingTime) {
            return {
                isAvailable: false,
                error: `The resataurant schedule on the selected day is: ${schedule?.opening_time} to ${schedule?.closing_time}`
            };
        }
        return {
            isAvailable: true
        };
    }
    async validateUserReservations(reservationDate, user_id) {
        const userReservations = await this.reservationRepository.createQueryBuilder("reservation")
            .leftJoin("reservation.user", "user")
            .where("user.id = :user_id", { user_id })
            .andWhere("reservation.date = :date", { date: reservationDate.format("YYYY-MM-DD") })
            .getCount();
        if (userReservations === 3) {
            return {
                canMakeAreservation: false,
                error: "Maximun 3 reservations per day allowed"
            };
        }
        return {
            canMakeAreservation: true
        };
    }
    async validateTableAvailability(table_id, reservationStart, party_size) {
        const tableCapacity = await this.tableRepository.findOne({
            where: {
                id: table_id,
                is_active: true,
            },
            select: { capacity: true }
        });
        if (+tableCapacity?.capacity < party_size) {
            return {
                isTableAvailable: false,
                error: "Table capacity is not enough for your party size"
            };
        }
        const reservationEnd = reservationStart.add(2, "hours");
        const query = this.reservationRepository.createQueryBuilder("reservation")
            .leftJoin("reservation.table", "table")
            .where("table.id = :table_id", { table_id })
            .andWhere("reservation.date = :date", { date: reservationStart.format("YYYY-MM-DD") })
            .andWhere("reservation.status In (:...statuses)", {
            statuses: [status_1.Status.CONFIRMED, status_1.Status.SEATED]
        });
        if (this.dataSource.options?.type === "sqlite") {
            query.andWhere(`"reservation"."time_start" < :endTime
     AND TIME("reservation"."time_start", '+2 hours') > :startTime`, {
                startTime: reservationStart.format("HH:mm:ss"),
                endTime: reservationEnd.format('HH:mm:ss'),
                duration: 2
            });
        }
        else {
            query.andWhere(`"reservation"."time_start" < :endTime
     AND "reservation"."time_start" + interval '2 hour' > :startTime`, {
                startTime: reservationStart.format("HH:mm:ss"),
                endTime: reservationEnd.format('HH:mm:ss'),
                duration: 2
            });
        }
        const conflictReservations = await query.getMany();
        if (conflictReservations.length > 0) {
            return {
                isTableAvailable: false,
                error: "The selected table is not available at the selected time and date"
            };
        }
        return {
            isTableAvailable: true,
        };
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_2.InjectRepository)(schedule_entity_1.Schedule)),
    __param(2, (0, typeorm_2.InjectRepository)(table_entity_1.Table)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.DataSource])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map