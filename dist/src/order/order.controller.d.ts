import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ChangeOrderStatus } from './dto/change-order-status.dto';
import { Order } from './entities/order.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto, user: any): Promise<Order | undefined>;
    findAll(pagination: PaginationDto, user: any): Promise<Order[]>;
    findOne(id: string, user: any): Promise<Order>;
    changeOrderStatus(id: string, changeOrderStatus: ChangeOrderStatus, user: any): Promise<Order | undefined>;
    update(id: string, updateOrderDto: UpdateOrderDto, user: any): Promise<Order | undefined>;
}
