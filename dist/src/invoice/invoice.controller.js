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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("./invoice.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const update_invoice_dto_1 = require("./dto/update-invoice.dto");
const auth_decorator_1 = require("../user/decorators/auth.decorator");
const roles_1 = require("../common/enums/roles");
const get_user_decorator_1 = require("../user/decorators/get-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
const InvoiceStatus_1 = require("./enum/InvoiceStatus");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const swagger_1 = require("@nestjs/swagger");
const invoice_entity_1 = require("./entities/invoice.entity");
let InvoiceController = class InvoiceController {
    invoiceService;
    configService;
    stripe;
    logger = new common_1.Logger("InvoiceController");
    constructor(invoiceService, configService) {
        this.invoiceService = invoiceService;
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get("STRIPE_SECRET_KEY"), {
            apiVersion: "2025-08-27.basil"
        });
    }
    create(createInvoiceDto, user) {
        return this.invoiceService.create(createInvoiceDto, user);
    }
    async stripeWebHook(req, res, signature) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.body, signature, this.configService.get("STRIPE_WEBHOOK_SECRET"));
        }
        catch (error) {
            this.logger.error(error);
            return res.status(400).send('Webhook signature verification failed.');
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const invoiceId = session.metadata?.invoice_id;
            if (!invoiceId)
                return res.status(400).send('No invoice_id');
            switch (session.payment_status) {
                case 'paid':
                case 'no_payment_required':
                    await this.invoiceService.changeInvoiceStatus(invoiceId, InvoiceStatus_1.InvoiceStatus.PAID, session.payment_intent);
                    break;
                case 'unpaid':
                    await this.invoiceService.changeInvoiceStatus(invoiceId, InvoiceStatus_1.InvoiceStatus.PENDING, session.payment_intent);
                    break;
                default:
                    await this.invoiceService.changeInvoiceStatus(invoiceId, InvoiceStatus_1.InvoiceStatus.REJECTED, session.payment_intent);
                    break;
            }
        }
        res.json({ received: true });
    }
    findAll(pagination, user) {
        return this.invoiceService.findAll(pagination, user);
    }
    findOne(term, user) {
        return this.invoiceService.findOne(term, user);
    }
    update(id, updateInvoiceDto, user) {
        return this.invoiceService.update(id, updateInvoiceDto, user);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: "Create an invoice" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "invoice created", type: invoice_entity_1.Invoice }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "You have no the appropiate role to perform this action" }),
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN, roles_1.GeneralRoles.EMPLOYEE], {}, [roles_1.EmployeeRoles.CASHIER, roles_1.EmployeeRoles.MANAGER]),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Webhook for stripe payment confirmations" }),
    (0, common_1.Post)("webhook"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "stripeWebHook", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: "Get all invoices" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Invoices", type: [invoice_entity_1.Invoice] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, common_1.Get)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: "Find one invoice by a term of search" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Invoice", type: invoice_entity_1.Invoice }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invoice is not available" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Invoice not found" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "You have no permission to perform this action" }),
    (0, common_1.Get)(':term'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('term')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: "Update an Invoice" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Invoice updated successfully", type: invoice_entity_1.Invoice }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invoice is not available" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Invoice not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "You have no the appropiate role to perform this action" }),
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN, roles_1.GeneralRoles.EMPLOYEE], {}, [roles_1.EmployeeRoles.CASHIER, roles_1.EmployeeRoles.MANAGER]),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_invoice_dto_1.UpdateInvoiceDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "update", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoice'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService,
        config_1.ConfigService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map