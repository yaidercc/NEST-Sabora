import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { OrderService } from 'src/order/order.service';
import { User } from 'src/user/entities/user.entity';
import { StripeService } from 'src/common/services/stripe.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class InvoiceService {
    private readonly invoiceRepository;
    private readonly orderService;
    private readonly stripeService;
    private readonly logger;
    constructor(invoiceRepository: Repository<Invoice>, orderService: OrderService, stripeService: StripeService);
    create(createInvoiceDto: CreateInvoiceDto, user: User): Promise<{
        invoice: Invoice;
        checkoutUrl: any;
    } | undefined>;
    changeInvoiceStatus(invoiceId: string, invoiceStatus: string, payment_intent: string): Promise<void>;
    findAll(paginationDto: PaginationDto, user: User): Promise<Invoice[]>;
    findOne(term: string, user: User): Promise<Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto, user: User): Promise<Invoice>;
}
