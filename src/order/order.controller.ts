import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { GetUser } from 'src/user/decorators/get-user.decorator';
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
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.orderService.findOne(id, user);
  }

  @Patch(':id')
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE], {}, [EmployeeRoles.MANAGER, EmployeeRoles.COOKER, EmployeeRoles.WAITRESS])
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE, GeneralRoles.CLIENT], {}, [EmployeeRoles.MANAGER])
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
