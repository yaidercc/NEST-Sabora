import { User } from './../../user/entities/user.entity';
import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid"
import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { mockMenuItemRepo } from "src/menu_item/tests/mocks/menuItem.mock";
import { MenuItemService } from "src/menu_item/menu_item.service";
import { Table } from "src/table/entities/table.entity";
import { TableService } from "src/table/table.service";
import { mockTable, tableId } from "src/table/tests/mocks/tableMocks";
import { TableMother } from "src/table/tests/tableMother";
import { MenuItemMother } from "src/menu_item/tests/menuItemMother";
import { GeneralRoles } from "src/common/enums/roles";
import { UserMother } from "src/user/tests/userMother";
import { mockDataSource, mockManager, mockUploadService } from 'src/common/tests/mocks/common.mocks';
import { UploadService } from 'src/common/services/upload.service';
import { UserService } from 'src/user/user.service';
import { mockConfigService, mockRoleRepo, mockUserRepo } from 'src/user/tests/mocks/user.mocks';
import { GeneralRole } from 'src/user/entities/general_role.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { mockEmployeeRepo } from 'src/employee/tests/mocks/employee.mock';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { OrderStatus } from '../enum/order_status';
import { StripeService } from 'src/common/services/stripe.service';
import { OrderService } from 'src/order/order.service';
import { Order } from 'src/order/entities/order.entity';
import { mockMenuItemService, mockOrder, mockOrderDetail, orderId } from 'src/order/tests/mocks/orderMocks';
import { OrderDetail } from 'src/order/entities/order_detail.entity';
import { OrderMother } from 'src/order/tests/orderMother';
import { InvoiceMother } from './invoiceMother';
import { invoiceId, mockInvoice, mockStripe } from './mocks/invoiceMocks';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../entities/invoice.entity';
import { EnvConfiguration } from 'src/config/env.config';
import { JoiEnvValidation } from 'src/config/joi.validation';
import { InvoiceStatus } from '../enum/InvoiceStatus';

describe("Unit OrderServices tests", () => {
    let invoiceService: InvoiceService;

    const user = {
        id: uuid(),
        ...UserMother.dto(),
        is_active: true,
        is_temporal_password: false,
        role: {
            id: uuid(),
            name: GeneralRoles.CLIENT
        },

    } as unknown as User;


    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: ".env.test",
                    load: [EnvConfiguration],
                    validationSchema: JoiEnvValidation
                }),
                JwtModule.register({
                    secret: 'secret123',
                    signOptions: { expiresIn: '1h' },
                }),
            ],
            providers: [
                InvoiceService,
                OrderService,
                TableService,
                UploadService,
                UserService,
                StripeService,
                {
                    provide: StripeService,
                    useValue: mockStripe
                },
                {
                    provide: getRepositoryToken(Invoice),
                    useValue: mockInvoice
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo
                },
                {
                    provide: getRepositoryToken(GeneralRole),
                    useValue: mockRoleRepo
                },
                {
                    provide: getRepositoryToken(Employee),
                    useValue: mockEmployeeRepo
                },
                {
                    provide: getRepositoryToken(Order),
                    useValue: mockOrder
                },
                {
                    provide: getRepositoryToken(OrderDetail),
                    useValue: mockOrderDetail
                },
                {
                    provide: getRepositoryToken(Table),
                    useValue: mockTable
                },
                {
                    provide: getRepositoryToken(MenuItem),
                    useValue: mockMenuItemRepo
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                },
                {
                    provide: MenuItemService,
                    useValue: mockMenuItemService
                },
                {
                    provide: UploadService,
                    useValue: mockUploadService
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        }).compile()

        invoiceService = module.get<InvoiceService>(InvoiceService)
    })


    it('should create a order', async () => {
        const orderDTO = OrderMother.dto()
        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...orderDTO, table, user }

        const invoiceDTO = InvoiceMother.dto({
            order: order.id
        });

        const invoice = { id: invoiceId, ...invoiceDTO, order };

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockOrder.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        mockOrder.findOneBy.mockReturnValue(order)


        mockInvoice.create.mockReturnValue(invoice)
        mockInvoice.save.mockReturnValue(invoice)

        const response = await invoiceService.create(invoiceDTO, user);

        expect(mockInvoice.create).toHaveBeenCalled()
        expect(mockInvoice.save).toHaveBeenCalled()
        expect(response?.invoice).toMatchObject(invoice);
    });


    it('should return all tables', async () => {
        const table = { id: tableId, ...TableMother.dto() }

        const order1 = { id: orderId, ...OrderMother.dto(), table, user }
        const order2 = { id: uuid(), ...OrderMother.dto(), table, user }

        const invoice1 = { id: invoiceId, ...InvoiceMother.dto(), order1 }
        const invoice2 = { id: uuid(), ...InvoiceMother.dto(), order2 }

        mockInvoice.find.mockReturnValue([
            invoice1,
            invoice2
        ])

        const response = await invoiceService.findAll({ limit: 10, offset: 0 }, user);

        expect(mockInvoice.find).toHaveBeenCalled()
        expect(response).toEqual([invoice1, invoice2]);
    });

    it('should return an order', async () => {
        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...OrderMother.dto(), table, user }

        const invoice = { id: invoiceId, ...InvoiceMother.dto(), order }

        mockInvoice.findOne.mockResolvedValue(invoice)

        const response = await invoiceService.findOne(invoiceId, user);

        expect(mockInvoice.findOne).toHaveBeenCalled()
        expect(response).toEqual(invoice);
    });



    it('should update a invoice', async () => {
        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...OrderMother.dto(), table, user }

        const invoice = { id: invoiceId, ...InvoiceMother.dto(), order, status:InvoiceStatus.PENDING }

        const dtoUpdate = {
            service_fee_rate: 0.5
        }

        const updatedInvoice = { ...invoice, ...dtoUpdate }

        mockInvoice.findOne.mockReturnValue(invoice)

        const response = await invoiceService.update(tableId, dtoUpdate, user);

        expect(mockInvoice.findOne).toHaveBeenCalled()
        expect(response).toMatchObject(updatedInvoice)

    });

    it('should change an order status', async () => {
        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...OrderMother.dto(), table, user }

        const invoice = { id: invoiceId, ...InvoiceMother.dto(), order, status:InvoiceStatus.PENDING }

        mockInvoice.findOneBy.mockReturnValue(invoice)
        mockInvoice.save.mockReturnValue({...invoice, status:InvoiceStatus.PAID })

        const response = await invoiceService.changeInvoiceStatus(orderId, InvoiceStatus.PAID, "fake_payment_intent");

        expect(mockInvoice.save).toHaveBeenCalled()
    });



})