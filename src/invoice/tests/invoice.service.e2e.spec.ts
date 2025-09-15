import { TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { TestDatabaseManager } from "src/common/tests/test-database";
import { AdminLogin, TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";

import { TableMother } from "src/table/tests/tableMother";
import { UserMother } from "src/user/tests/userMother";
import { MenuItemMother } from "src/menu_item/tests/menuItemMother";
import { OrderMother } from "src/order/tests/orderMother";
import { PaymentMethods } from "../enum/payment_methods";
import { InvoiceMother } from "./invoiceMother";
import { Invoice } from "../entities/invoice.entity";
import { UpdateInvoiceDto } from "../dto/update-invoice.dto";
import { InvoiceStatus } from "../enum/InvoiceStatus";
import Stripe from 'stripe';
import { ConfigService } from "@nestjs/config";



describe("Integrations test TablesService", () => {
    let module: TestingModule;
    let app: INestApplication
    let adminLogin: AdminLogin | undefined
    let services: TestServices
    let repositories: TestRepositories
    let orderMother: OrderMother;
    let invoiceMother: InvoiceMother;
    let configService: ConfigService;
    let stripe: Stripe

    beforeAll(async () => {
        // Initializing module and Nest app
        const testDB = await TestDatabaseManager.initializeE2E()
        app = testDB.app
        module = testDB.module
        configService = module.get(ConfigService);
        services = TestHelpers.getServices(module)
        repositories = TestHelpers.getRepositories(module)
        orderMother = new OrderMother(
            services.menuItemService,
            services.tableService,
            services.orderService,
            services.userService,
            services.employeesService,
            repositories.employeeRoleRepository
        )
        invoiceMother = new InvoiceMother(
            services.invoiceService,
            services.userService,
            services.employeesService,
            repositories.employeeRoleRepository,
            orderMother
        )
        stripe = new Stripe(configService.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-08-27.basil", 
});
    })

    // Cleaning up the data before each test
    beforeEach(async () => {
        await services.seedService.executeSEED();
        adminLogin = await TestHelpers.loginAsAdmin(app);
    })

    // Closing the nest aplication at the end of the tests
    afterAll(async () => {
        await TestDatabaseManager.cleanUp();
    });

    it("POST /order", async () => {
        const [order] = await orderMother.createManyOrders(1)
        const invoiceDTO = InvoiceMother.dto({
            order: order.id
        });
        const response = await request(app.getHttpServer())
            .post('/invoice')
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(invoiceDTO)

        expect(response.status).toBe(201)
        expect(response.body).toBeDefined()
        expect(response.body).toHaveProperty("invoice");
        expect(response.body).toHaveProperty("checkoutUrl");

    })

    it("GET /invoice/term", async () => {
        const [{ invoice }] = await invoiceMother.createManyInvoices(1)

        const response = await request(app.getHttpServer())
            .get(`/invoice/${invoice.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body.order).toMatchObject({
            id: invoice.order.id,
            status: invoice.order.status,
            is_customer_order: invoice.order.is_customer_order,
            date: invoice.order.date,
            subtotal: invoice.order.subtotal,
            user: {
                id: invoice.order.user.id,
                full_name: invoice.order.user.full_name,
                username: invoice.order.user.username,
                email: invoice.order.user.email,
                phone: invoice.order.user.phone,
                role: {
                    id: invoice.order.user.role.id,
                    name: invoice.order.user.role.name,
                },
            },
            table: {
                id: invoice.order.table.id,
                name: invoice.order.table.name,
                capacity: invoice.order.table.capacity,
            },
            order_details: invoice.order.order_details.map((detail) => ({
                id: detail.id,
                quantity: detail.quantity,
                menu_item: {
                    id: detail.menu_item.id,
                    name: detail.menu_item.name,
                    price: detail.menu_item.price,
                },
            })),
        });

    })


    it("GET /order", async () => {
        await invoiceMother.createManyInvoices(2)

        const response = await request(app.getHttpServer())
            .get(`/invoice/?limit=${10}&offset=${0}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)
    })



    it("PATCH /invoice", async () => {
        const [{ invoice }] = await invoiceMother.createManyInvoices(1)
        const dtoUpdate = { service_fee_rate: 1.0 }

        const response = await request(app.getHttpServer())
            .patch(`/invoice/${invoice.id}`)
            .set('Authorization', `Bearer ${adminLogin?.token}`)
            .send(dtoUpdate)

        expect(response.status).toBe(200)
        expect(response.body.service_fee_rate).toBe(dtoUpdate.service_fee_rate)

    })

    it('POST /webhook', async () => {
        const mockEvent: any = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    metadata: { invoice_id: '123' },
                    payment_status: 'paid',
                    payment_intent: 'pi_123',
                },
            },
        };

        jest.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(mockEvent);
        jest.spyOn(services.invoiceService, 'changeInvoiceStatus').mockResolvedValue(undefined);

        const response = await request(app.getHttpServer())
            .post('/invoice/webhook')
            .set('stripe-signature', 'valid_signature')
            .send({}); 

        expect(response.status).toBe(200);
        expect(services.invoiceService.changeInvoiceStatus).toHaveBeenCalledWith(
            '123',
            InvoiceStatus.PAID,
            'pi_123',
        );
    });

})