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
    const { table: tableId, order_details } = createOrderDto
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect()
      queryRunner.startTransaction()

      const table = await this.tableService.findOne(tableId);

      const order = queryRunner.manager.create(Order, {
        table,
        user,
        date: new Date().toISOString()
      })

      if (!createOrderDto.is_customer_order && createOrderDto.customer) {
        const customer = await this.userService.findOne(createOrderDto.customer)
        order.customer = customer
      }

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

      return order
    } catch (error) {
      await queryRunner.rollbackTransaction()
      handleException(error, this.logger)
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto

    const isAdmin = user.role.name === GeneralRoles.ADMIN;
    const isManager = user.employee?.employee_role.name === EmployeeRoles.MANAGER;
    let where: any = { is_active: true }

    if (!isAdmin && !isManager) {
      where = {
        is_active: true,
        $or: [
          { customer: { id: user.id } },
          { user: { id: user.id } }
        ]
      }
    }

    return await this.orderRepository.find({
      take: limit,
      skip: offset,
      where
    })
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
    const isManager = user.employee?.employee_role.name === EmployeeRoles.MANAGER;

    if (!isOwner && !isAdmin && !isManager) {
      throw new ForbiddenException("You have no permission to perform this action");
    }


    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: User) {
    const { is_customer_order, customer: customerId, table: tableId, order_details, ...restInfo } = updateOrderDto
    try {
      const order = await this.orderRepository.preload({
        id,
        ...restInfo
      })

      if (!order) throw new NotFoundException("Order not found")

      const is_active = await isActive(order.id, this.orderRepository);
      if (!is_active) {
        throw new BadRequestException("Order is not available")
      }

      const isOwner = order.customer?.id === user.id || order.user.id === user.id;
      const isAdmin = user.role.name === GeneralRoles.ADMIN;
      const isManager = user.employee?.employee_role.name === EmployeeRoles.MANAGER;

      if (!isOwner && !isAdmin && !isManager) {
        throw new ForbiddenException("You have no permission to perform this action");
      }

      if (!order.is_customer_order && customerId) {
        const customer = await this.userService.findOne(customerId)
        order.customer = customer
      }

      if (tableId) {
        const table = await this.tableService.findOne(tableId);
        order.table = table!
      }


      if (order_details) {
        let subtotal = 0

        await this.orderDetailsRepository.delete({ order: { id } });

        for (let i = 0; i < order_details.length; i++) {
          const menu_item = await this.menuItemService.findOne(order_details[i].menu_item)

          subtotal += menu_item.price * order_details[i].quantity

          const order_detail = await this.orderDetailsRepository.create({
            order,
            quantity: order_details[i].quantity,
            menu_item
          })

          await this.orderDetailsRepository.save(order_detail)
        }
        order.subtotal = subtotal
      }
      await this.orderRepository.save(order)
      return this.findOne(id, user)

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async cancelOrder(id: string, user: User) {
    const order = await this.findOne(id, user)
    
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("You cannot cancel an while is beign prepared or is already delivered")
    }

    await this.orderRepository.update(id, { status: OrderStatus.CANCELLED })
    await this.orderDetailsRepository.update({ order }, { status: OrderStatus.CANCELLED })
  }
}
