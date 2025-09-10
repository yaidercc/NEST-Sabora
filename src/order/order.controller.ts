import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @Auth()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE], {}, [EmployeeRoles.MANAGER])
  findAll(@Query() pagination: PaginationDto, @GetUser() user) {
    return this.orderService.findAll(pagination, user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.orderService.findOne(id, user);
  }

  @Patch(':id')
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE], {}, [EmployeeRoles.MANAGER, EmployeeRoles.COOKER, EmployeeRoles.WAITRESS])
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto,  @GetUser() user) {
    return this.orderService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE, GeneralRoles.CLIENT], {}, [EmployeeRoles.MANAGER])
  cancelOrder(@Param('id') id: string,  @GetUser() user) {
    return this.orderService.cancelOrder(id, user);
  }
}
