import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { TableService } from 'src/table/table.service';
import { MenuItemService } from 'src/menu_item/menu_item.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserService } from 'src/user/user.service';
import { ChangeOrderStatus } from './dto/change-order-status.dto';
export declare class OrderService {
    private readonly orderRepository;
    private readonly orderDetailsRepository;
    private readonly tableService;
    private readonly menuItemService;
    private readonly userService;
    private readonly dataSource;
    private readonly logger;
    constructor(orderRepository: Repository<Order>, orderDetailsRepository: Repository<OrderDetail>, tableService: TableService, menuItemService: MenuItemService, userService: UserService, dataSource: DataSource);
    create(createOrderDto: CreateOrderDto, user: User): Promise<Order | undefined>;
    findAll(paginationDto: PaginationDto, user: User): Promise<Order[]>;
    findOne(id: string, user: User): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto, user: User): Promise<Order | undefined>;
    changeOrderStatus(id: string, changeOrderStatus: ChangeOrderStatus, user: User): Promise<Order | undefined>;
    private validateStatusTransaction;
    private validateStatusPermissions;
}
