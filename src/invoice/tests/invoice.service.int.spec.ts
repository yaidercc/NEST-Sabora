import { TestingModule } from "@nestjs/testing";
import { TestDatabaseManager } from "src/common/tests/test-database";
import { TestHelpers, TestRepositories, TestServices } from "src/common/tests/test-helpers";
import { InvoiceMother } from "./invoiceMother";
import { UserMother } from "src/user/tests/userMother";
import { User } from "src/user/entities/user.entity";
import { TableMother } from "src/table/tests/tableMother";
import { MenuItemMother } from "src/menu_item/tests/menuItemMother";
import { OrderMother } from "src/order/tests/orderMother";
import { InvoiceStatus } from "../enum/InvoiceStatus";

describe("Integrations test InvoiceService", () => {
    let services: TestServices
    let repositories: TestRepositories
    let module: TestingModule;
    let orderMother: OrderMother;
    let user;
    let invoiceMother: InvoiceMother;
    beforeAll(async () => {
        module = await TestDatabaseManager.initializeInt();
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
        user = await services.userService.findOne("jhonDoe");

    })

    beforeEach(async () => {
        await services.seedService.executeSEED()
    })

    afterAll(async () => {
        await module.close();
    });

    it("Should create an invoice", async () => {
        const [order] = await orderMother.createManyOrders(1)

        const invoiceDTO = InvoiceMother.dto({
            order: order.id
        })

        const response = await services.invoiceService.create(invoiceDTO, user as User)

        expect(response).toBeDefined()
        expect(response).toHaveProperty("invoice");
        expect(response).toHaveProperty("checkoutUrl");

    })


    it("Should get an invoice", async () => {
        const [{ invoice }] = await invoiceMother.createManyInvoices(1)

        const response = await services.invoiceService.findOne(invoice.id, invoice.order.user)

        expect(response).toBeDefined()
        expect(response).toMatchObject(invoice)
    })


    it("Should return all invoices", async () => {
        const [invoice1, invoice2] = await invoiceMother.createManyInvoices(2)
        const response = await services.invoiceService.findAll({ limit: 10, offset: 0 }, user)

        expect(response).toBeDefined()
        expect(response).toHaveLength(2)
        expect(response).toEqual(expect.arrayContaining([invoice1.invoice, invoice2.invoice]))
    })


    it("Should update an invoice", async () => {
        const [{ invoice }] = await invoiceMother.createManyInvoices(1)
        const dtoUpdate = { service_fee_rate: 1.0 }

        const response = await services.invoiceService.update(invoice.id, dtoUpdate, user)

        expect(response).toBeDefined()
        expect(response.service_fee_rate).toBe(dtoUpdate.service_fee_rate)
    })

    it("Should change invoice status", async () => {
        const [{ invoice }] = await invoiceMother.createManyInvoices(1)
        await services.invoiceService.changeInvoiceStatus(invoice.id, InvoiceStatus.PAID, user)

        const response = await services.invoiceService.findOne(invoice.id, invoice.order.user)

        expect(response.status).toBe(InvoiceStatus.PAID)
    });

})