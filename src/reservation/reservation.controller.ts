import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Reservation } from './entities/reservation.entity';

@ApiBearerAuth('access-token')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @ApiOperation({ summary: "Create a reservation" })
  @ApiResponse({ status: 201, description: "reseravtion created", type: Reservation })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "User not found/Unauthorized" })
  @Post()
  @Auth()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @ApiOperation({ summary: "Find one reservation by id" })
  @ApiResponse({ status: 200, description: "Reservation", type: Reservation })
  @ApiResponse({ status: 401, description: "User not found/Unauthorized" })
  @ApiResponse({ status: 403, description: "You have no permission to perform this action" })
  @ApiResponse({ status: 404, description: "Reservation not found" })
  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.reservationService.findOne(id, user);
  }

  @ApiOperation({ summary: "Change reservation status" })
  @ApiResponse({ status: 200, description: "Reservation status updated successfully", type: Reservation })
  @ApiResponse({ status: 401, description: "User not found/Unauthorized" })
  @ApiResponse({ status: 403, description: "You have no permission to perform this action" })
  @ApiResponse({ status: 404, description: "Reservation not found" })
  @Patch(':id')
  @Auth()
  changeReservationStatus(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto, @GetUser() user: User) {
    return this.reservationService.changeReservationStatus(id, updateReservationDto, user);
  }

}
