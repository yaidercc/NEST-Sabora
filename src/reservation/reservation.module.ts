import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from './entities/schedule.entity';
import { UserModule } from 'src/user/user.module';
import { TableModule } from 'src/table/table.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Schedule]), UserModule,TableModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [TypeOrmModule]
})
export class ReservationModule { }
