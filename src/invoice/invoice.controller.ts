import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Headers, HttpCode, Logger, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { InvoiceStatus } from './enum/InvoiceStatus';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Invoice } from './entities/invoice.entity';


@Controller('invoice')
export class InvoiceController {

  private stripe: Stripe;
  private readonly logger = new Logger("InvoiceController")

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly configService: ConfigService
  ) {
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil"
    })
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Create an invoice" })
  @ApiResponse({ status: 201, description: "invoice created", type: Invoice })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 409, description: "You have no the appropiate role to perform this action" })
  @Post()
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE], {}, [EmployeeRoles.CASHIER, EmployeeRoles.MANAGER])
  create(@Body() createInvoiceDto: CreateInvoiceDto, @GetUser() user: User) {
    return this.invoiceService.create(createInvoiceDto, user);
  }

  @ApiOperation({ summary: "Webhook for stripe payment confirmations" })
  @Post("webhook")
  @HttpCode(200)
  async stripeWebHook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    // Validate that the data really comes from stripe
    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        this.configService.get("STRIPE_WEBHOOK_SECRET")!,
      );
    } catch (error) {
      this.logger.error(error)
      return res.status(400).send('Webhook signature verification failed.');
    }

    // Validate if the payment was completed 
    if (event.type === 'checkout.session.completed') {
      // Gets the stripe session info
      const session = event.data.object as Stripe.Checkout.Session;

      const invoiceId = session.metadata?.invoice_id;

      if (!invoiceId) return res.status(400).send('No invoice_id');

      // Validate the payment status
      switch (session.payment_status) {
        case 'paid':
        case 'no_payment_required':
          await this.invoiceService.changeInvoiceStatus(invoiceId, InvoiceStatus.PAID, session.payment_intent as string);
          break;
        case 'unpaid':
          await this.invoiceService.changeInvoiceStatus(invoiceId, InvoiceStatus.PENDING, session.payment_intent as string);
          break;
        default:
          await this.invoiceService.changeInvoiceStatus(invoiceId, InvoiceStatus.REJECTED, session.payment_intent as string);
          break;
      }
    }

    // Stripe needs to recieve a 200 ok response otherwise stripe will continue sending the payment response over and over again
    res.json({ received: true });

  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Get all invoices" })
  @ApiResponse({ status: 200, description: "Invoices", type: [Invoice] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  @Auth()
  findAll(@Query() pagination: PaginationDto, @GetUser() user) {
    return this.invoiceService.findAll(pagination, user);
  }


  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Find one invoice by a search term" })
  @ApiResponse({ status: 200, description: "Invoice", type: Invoice })
  @ApiResponse({ status: 400, description: "Invoice is not available" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Invoice not found" })
  @ApiResponse({ status: 403, description: "You have no permission to perform this action" })
  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string, @GetUser() user: User) {
    return this.invoiceService.findOne(term, user);
  }


  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Update an Invoice" })
  @ApiResponse({ status: 200, description: "Invoice updated successfully", type: Invoice })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 400, description: "Invoice is not available" })
  @ApiResponse({ status: 404, description: "Invoice not found" })
  @ApiResponse({ status: 409, description: "You have no the appropiate role to perform this action" })
  @Patch(':id')
  @Auth([GeneralRoles.ADMIN, GeneralRoles.EMPLOYEE], {}, [EmployeeRoles.CASHIER, EmployeeRoles.MANAGER])
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto, @GetUser() user: User) {
    return this.invoiceService.update(id, updateInvoiceDto, user);
  }

}
