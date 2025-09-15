"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const invoice_entity_1 = require("./entities/invoice.entity");
const order_service_1 = require("../order/order.service");
const handleErrors_1 = require("../common/helpers/handleErrors");
const stripe_service_1 = require("../common/services/stripe.service");
const payment_methods_1 = require("./enum/payment_methods");
const typeorm_2 = require("@nestjs/typeorm");
const roles_1 = require("../common/enums/roles");
const InvoiceStatus_1 = require("./enum/InvoiceStatus");
let InvoiceService = class InvoiceService {
    invoiceRepository;
    orderService;
    stripeService;
    logger = new common_1.Logger("InvoiceService");
    constructor(invoiceRepository, orderService, stripeService) {
        this.invoiceRepository = invoiceRepository;
        this.orderService = orderService;
        this.stripeService = stripeService;
    }
    async create(createInvoiceDto, user) {
        try {
            const order = await this.orderService.findOne(createInvoiceDto.order, user);
            const service_fee = Number(order.subtotal) * createInvoiceDto.service_fee_rate;
            const total = service_fee + Number(order.subtotal);
            const invoice = this.invoiceRepository.create({
                service_fee_rate: createInvoiceDto.service_fee_rate,
                payment_method: createInvoiceDto.payment_method,
                order,
                total
            });
            let session;
            await this.invoiceRepository.save(invoice);
            if ([payment_methods_1.PaymentMethods.CREDIT_CARD.valueOf(), payment_methods_1.PaymentMethods.DEBIT_CARD.valueOf()].includes(createInvoiceDto.payment_method)) {
                session = await this.stripeService.createCheckoutSession([...order.order_details.map(item => ({
                        quantity: item.quantity,
                        name: item.menu_item.name,
                        price: item.menu_item.price
                    })),
                    {
                        quantity: 1,
                        name: "service fee",
                        price: service_fee
                    }
                ], invoice.id);
                invoice.stripe_session_id = session.id;
                await this.invoiceRepository.save(invoice);
            }
            return { invoice, checkoutUrl: session?.url || null };
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async changeInvoiceStatus(invoiceId, invoiceStatus, payment_intent) {
        const invoice = await this.invoiceRepository.findOneBy({ id: invoiceId });
        if (!invoice)
            throw new common_1.NotFoundException("Invoice not found");
        invoice.status = invoiceStatus;
        if (payment_intent)
            invoice.stripe_payment_intent_id = payment_intent;
        await this.invoiceRepository.save(invoice);
    }
    async findAll(paginationDto, user) {
        const { limit = 10, offset = 0 } = paginationDto;
        const isAdmin = user.role.name === roles_1.GeneralRoles.ADMIN;
        const isManager = user.employee?.employee_role.name === roles_1.EmployeeRoles.MANAGER;
        const isCashier = user.employee?.employee_role?.name === roles_1.EmployeeRoles.CASHIER;
        let whereConditions = {};
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
    async findOne(term, user) {
        let invoice = null;
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
        if (!invoice)
            throw new common_1.NotFoundException("Invoice not found");
        const isOwner = invoice.order.customer?.id === user.id || invoice.order.user.id === user.id;
        const isAdmin = user.role.name === roles_1.GeneralRoles.ADMIN;
        const isManager = user.employee?.employee_role?.name === roles_1.EmployeeRoles.MANAGER;
        const isCashier = user.employee?.employee_role?.name === roles_1.EmployeeRoles.CASHIER;
        if (!isOwner && !isAdmin && !isManager && !isCashier) {
            throw new common_1.ForbiddenException("You have no permission to perform this action");
        }
        return invoice;
    }
    async update(id, updateInvoiceDto, user) {
        const { order, ...restInvoiceInfo } = updateInvoiceDto;
        const invoice = await this.findOne(id, user);
        if (invoice.status !== InvoiceStatus_1.InvoiceStatus.PENDING) {
            throw new common_1.BadRequestException("You can only edit invoices with pending status");
        }
        if (restInvoiceInfo.service_fee_rate) {
            const service_fee = Number(invoice.total) * restInvoiceInfo.service_fee_rate;
            invoice.total = service_fee + Number(invoice.total);
            invoice.service_fee_rate = restInvoiceInfo.service_fee_rate;
        }
        if (restInvoiceInfo.payment_method)
            invoice.payment_method = restInvoiceInfo.payment_method;
        await this.invoiceRepository.save(invoice);
        return invoice;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        order_service_1.OrderService,
        stripe_service_1.StripeService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map