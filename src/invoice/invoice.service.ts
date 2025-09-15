import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { OrderService } from 'src/order/order.service';
import { handleException } from 'src/common/helpers/handleErrors';
import { User } from 'src/user/entities/user.entity';
import { StripeService } from 'src/common/services/stripe.service';
import { PaymentMethods } from './enum/payment_methods';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from "uuid"
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InvoiceStatus } from './enum/InvoiceStatus';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger("InvoiceService")
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService
  ) {

  }
  async create(createInvoiceDto: CreateInvoiceDto, user: User) {
    try {
      const order = await this.orderService.findOne(createInvoiceDto.order, user);

      const service_fee = Number(order.subtotal) * createInvoiceDto.service_fee_rate;
      const total = service_fee + Number(order.subtotal);


      const invoice = this.invoiceRepository.create({
        service_fee_rate: createInvoiceDto.service_fee_rate,
        payment_method: createInvoiceDto.payment_method,
        order,
        total
      })

      let session;
      await this.invoiceRepository.save(invoice);

      if ([PaymentMethods.CREDIT_CARD.valueOf(), PaymentMethods.DEBIT_CARD.valueOf()].includes(createInvoiceDto.payment_method)) {

        session = await this.stripeService.createCheckoutSession(
          [...order.order_details.map(item => ({
            quantity: item.quantity,
            name: item.menu_item.name,
            price: item.menu_item.price
          })),
          {
            quantity: 1,
            name: "service fee",
            price: service_fee
          }
          ],
          invoice.id
        )
        invoice.stripe_session_id = session.id
        await this.invoiceRepository.save(invoice);
      }
      return { invoice, checkoutUrl: session?.url || null };

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async changeInvoiceStatus(invoiceId: string, invoiceStatus: string, payment_intent: string) {
    const invoice = await this.invoiceRepository.findOneBy({ id: invoiceId });

    if (!invoice) throw new NotFoundException("Invoice not found")

    invoice.status = invoiceStatus
    if (payment_intent) invoice.stripe_payment_intent_id = payment_intent;

    await this.invoiceRepository.save(invoice)
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;
    const isAdmin = user.role.name === GeneralRoles.ADMIN;
    const isManager = user.employee?.employee_role.name === EmployeeRoles.MANAGER;
    const isCashier = user.employee?.employee_role?.name === EmployeeRoles.CASHIER;

    let whereConditions: any = { };

    if (!isAdmin && !isManager && !isCashier) {
      whereConditions = [
        {
          order: { customer: { id: user.id } }
        },
        {
          order: { user: { id: user.id } }
        }
      ];
    }

    return await this.invoiceRepository.find({
      where: whereConditions,
      relations: [
        'order',
        'order.user',
        'order.user.employee',
        'order.user.employee.employee_role',
        'order.user.role',
        'order.customer',
        'order.customer.employee',
        'order.table',
        'order.order_details',
        'order.order_details.menu_item'
      ],
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string, user: User) {
    let invoice: Invoice | null = null;
    invoice = await this.invoiceRepository.findOne({
      where: [
        { id: term },
        { order: { id: term } },
        { stripe_session_id: term },
        { stripe_payment_intent_id: term },
      ],
      relations: {
        order: { user: { employee: true }, customer: { employee: true }, }
      },
    });

    if (!invoice) throw new NotFoundException("Invoice not found")

    const isOwner = invoice.order.customer?.id === user.id || invoice.order.user.id === user.id;
    const isAdmin = user.role.name === GeneralRoles.ADMIN;
    const isManager = user.employee?.employee_role?.name === EmployeeRoles.MANAGER;
    const isCashier = user.employee?.employee_role?.name === EmployeeRoles.CASHIER;

    if (!isOwner && !isAdmin && !isManager && !isCashier) {
      throw new ForbiddenException("You have no permission to perform this action");
    }


    return invoice
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, user: User) {
    const { order, ...restInvoiceInfo } = updateInvoiceDto

    const invoice = await this.findOne(id, user)

    if(invoice.status !== InvoiceStatus.PENDING) {
      throw new BadRequestException("You can only edit invoices with pending status")
    }

    if (restInvoiceInfo.service_fee_rate) {

      const service_fee = Number(invoice.total) * restInvoiceInfo.service_fee_rate;

      invoice.total = service_fee + Number(invoice.total);
      invoice.service_fee_rate = restInvoiceInfo.service_fee_rate;
    }

    if (restInvoiceInfo.payment_method) invoice.payment_method = restInvoiceInfo.payment_method


    await this.invoiceRepository.save(invoice)

    return invoice

  }


}
