import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ChangeOrderStatus } from './dto/change-order-status.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Order } from './entities/order.entity';

@ApiBearerAuth('access-token')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @ApiOperation({ summary: "Create an order" })
  @ApiResponse({ status: 201, description: "order created", type: Order })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post()
  @Auth()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user) {
    return this.orderService.create(createOrderDto, user);
  }

  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({ status: 200, description: "Orders", type: [Order] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE], {}, [EmployeeRoles.MANAGER])
  findAll(@Query() pagination: PaginationDto, @GetUser() user) {
    return this.orderService.findAll(pagination, user);
  }

  @ApiOperation({ summary: "Find one order by a search term" })
  @ApiResponse({ status: 200, description: "Order", type: Order })
  @ApiResponse({ status: 400, description: "Order is not available" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 403, description: "You have no permission to perform this action" })
  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.orderService.findOne(id, user);
  }

  @ApiOperation({ summary: "Change the order status" })
  @ApiResponse({ status: 200, description: "Order status changed successfully", type: Order })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 400, description: "Cannot change status/Invalid status transition" })
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 409, description: "You have no the appropiate role to perform this action" })
  @Patch('change-order-status/:id')
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE], {}, [EmployeeRoles.MANAGER, EmployeeRoles.COOKER, EmployeeRoles.WAITRESS])
  changeOrderStatus(@Param('id') id: string, @Body() changeOrderStatus: ChangeOrderStatus, @GetUser() user) {
    return this.orderService.changeOrderStatus(id, changeOrderStatus, user);
  }

  @ApiOperation({ summary: "Update an order" })
  @ApiResponse({ status: 200, description: "Order updated successfully", type: Order })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 400, description: "Order is not available" })
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 409, description: "You have no the appropiate role to perform this action" })
  @Patch(':id')
  @Auth([], {}, [EmployeeRoles.MANAGER, EmployeeRoles.COOKER, EmployeeRoles.WAITRESS])
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @GetUser() user) {
    return this.orderService.update(id, updateOrderDto, user);
  }

}
