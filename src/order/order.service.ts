import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { handleException } from 'src/common/helpers/handleErrors';
import { TableService } from 'src/table/table.service';
import { MenuItemService } from 'src/menu_item/menu_item.service';
import { validate as isUUID } from "uuid"
import { isActive } from 'src/common/helpers/isActive';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserService } from 'src/user/user.service';
import { OrderStatus } from './enum/order_status';
import { ChangeOrderStatus } from './dto/change-order-status.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger("OrderService")
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,
    private readonly tableService: TableService,
    private readonly menuItemService: MenuItemService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) { }

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { table: tableId, order_details, customer: customerId, ...restOrderInfo } = createOrderDto
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect()
      queryRunner.startTransaction()
      const table = await this.tableService.findOne(tableId);

      const order = queryRunner.manager.create(Order, {
        ...restOrderInfo,
        table,
        user,
        date: new Date().toISOString()
      })

      if (!createOrderDto.is_customer_order && createOrderDto.customer) {
        const customer = await this.userService.findOne(createOrderDto.customer)
        order.customer = customer

      } else {
        order.customer = user
      }
      order.is_customer_order = createOrderDto.is_customer_order;

      await queryRunner.manager.save(order)
      let subtotal = 0

      for (let i = 0; i < order_details.length; i++) {
        const menu_item = await this.menuItemService.findOne(order_details[i].menu_item)
        subtotal += menu_item.price * order_details[i].quantity

        const order_detail = queryRunner.manager.create(OrderDetail, {
          order,
          quantity: order_details[i].quantity,
          menu_item
        })

        await queryRunner.manager.save(order_detail)
      }
      await queryRunner.manager.update(Order, order.id, { subtotal })

      await queryRunner.commitTransaction()

      return this.findOne(order.id, user)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      handleException(error, this.logger)
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    const isAdmin = user.role.name === GeneralRoles.ADMIN;
    const isManager = user.employee?.employee_role.name === EmployeeRoles.MANAGER;

    let whereConditions: any = { is_active: true };

    if (!isAdmin && !isManager) {

      whereConditions = [
        {
          is_active: true,
          customer: { id: user.id }
        },
        {
          is_active: true,
          user: { id: user.id }
        }
      ];
    }

    return await this.orderRepository.find({
      where: whereConditions,
      relations: [
        'user',
        'user.employee',
        'user.employee.employee_role',
        'user.role',
        'customer',
        'customer.employee',
        'table',
        'order_details',
        'order_details.menu_item'
      ],
      take: limit,
      skip: offset
    });
  }

  async findOne(id: string, user: User) {
    let order: Order | null = null;
    if (isUUID(id)) order = await this.orderRepository.findOneBy({ id: id })
    if (!order) throw new NotFoundException("Order not found")


    const is_active = await isActive(order.id, this.orderRepository);
    if (!is_active) {
      throw new BadRequestException("Order is not available")
    }

    const isOwner = order.customer?.id === user.id || order.user.id === user.id;
    const isAdmin = user.role.name === GeneralRoles.ADMIN;
    const isManager = user.employee?.employee_role?.name === EmployeeRoles.MANAGER;
    const isCashier = user.employee?.employee_role?.name === EmployeeRoles.CASHIER;

    if (!isOwner && !isAdmin && !isManager && !isCashier) {
      throw new ForbiddenException("You have no permission to perform this action");
    }


    return order
  }

async update(id: string, updateOrderDto: UpdateOrderDto, user: User) {
  const { customer: customerId, table: tableId, order_details } = updateOrderDto;

  try {
    const order = await this.findOne(id, user);

    if (!order.is_customer_order && customerId) {
      order.customer = await this.userService.findOne(customerId);
    }

    if (tableId) {
      const table = await this.tableService.findOne(tableId);
      order.table =  table!
    }

    if (order_details) {
      let subtotal = 0;

      const newDetails: OrderDetail[] = [];
      for (const dto of order_details) {
        const menu_item = await this.menuItemService.findOne(dto.menu_item);
        subtotal += menu_item.price * dto.quantity;

        const detail = this.orderDetailsRepository.create({
          order,
          quantity: dto.quantity,
          menu_item,
        });

        newDetails.push(detail);
      }
      await this.orderDetailsRepository.save(newDetails);
      order.order_details = newDetails
      order.subtotal = subtotal;
    }

    await this.orderRepository.save(order);

    return this.findOne(id, user)
  } catch (error) {
    handleException(error, this.logger);
  }
}


  async changeOrderStatus(id: string, changeOrderStatus: ChangeOrderStatus, user: User) {
    const { status } = changeOrderStatus
    try {
      const order = await this.findOne(id, user)

      this.validateStatusTransaction(order.status, status)

      this.validateStatusPermissions(user, status)

      await this.orderRepository.update(id, { status })

      return this.findOne(id, user)


    } catch (error) {
      handleException(error, this.logger)
    }
  }

  private validateStatusTransaction(currentStatus: string, newStatus: string) {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };
    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }
  }

  private validateStatusPermissions(user: User, newStatus: string) {
    const userRole = user.role.name;
    const employeeRole = user.employee?.employee_role?.name;

    const isAdmin = userRole === GeneralRoles.ADMIN;
    const isManager = employeeRole === EmployeeRoles.MANAGER;
    const isCooker = employeeRole === EmployeeRoles.COOKER;
    const isWaitress = employeeRole === EmployeeRoles.WAITRESS;

    if (isAdmin || isManager) return;

    switch (newStatus) {
      case OrderStatus.CONFIRMED:
        if (!isCooker && !isWaitress) {
          throw new ForbiddenException('Only cooks and waitresses can confirm orders');
        }
        break;

      case OrderStatus.PREPARING:
        if (!isCooker) {
          throw new ForbiddenException('Only cooks can mark orders as preparing');
        }
        break;

      case OrderStatus.READY:
        if (!isCooker) {
          throw new ForbiddenException('Only cooks can mark orders as ready');
        }
        break;

      case OrderStatus.DELIVERED:
        if (!isWaitress) {
          throw new ForbiddenException('Only waitresses can mark orders as delivered');
        }
        break;

      case OrderStatus.CANCELLED:
        break;

      default:
        throw new BadRequestException(`Invalid status transition to ${newStatus}`);
    }
  }

}
