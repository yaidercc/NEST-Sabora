import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Invoice } from './entities/invoice.entity';
export declare class InvoiceController {
    private readonly invoiceService;
    private readonly configService;
    private stripe;
    private readonly logger;
    constructor(invoiceService: InvoiceService, configService: ConfigService);
    create(createInvoiceDto: CreateInvoiceDto, user: User): Promise<{
        invoice: Invoice;
        checkoutUrl: any;
    } | undefined>;
    stripeWebHook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>> | undefined>;
    findAll(pagination: PaginationDto, user: any): Promise<Invoice[]>;
    findOne(term: string, user: User): Promise<Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto, user: User): Promise<Invoice>;
}
