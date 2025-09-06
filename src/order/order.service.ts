import { Injectable, Logger } from '@nestjs/common';
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
      await queryRunner.manager.save(order)

      for (let i = 0; i < order_details.length; i++) {
        const menu_item = await this.menuItemService.findOne(order_details[i].menu_item)

        const order_detail = queryRunner.manager.create(OrderDetail, {
          order,
          quantity: order_details[i].quantity,
          menu_item
        })

        await queryRunner.manager.save(order_detail)
      }

      await queryRunner.commitTransaction()

      return order
    } catch (error) {
      await queryRunner.rollbackTransaction()
      handleException(error, this.logger)
    } finally {
      await queryRunner.release()
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: string, user: User) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
