import { User } from './../../user/entities/user.entity';
import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid"
import { OrderService } from "../order.service";
import { Order } from "../entities/order.entity";
import { mockMenuItemService, mockOrder, mockOrderDetail, orderId } from "./mocks/orderMocks";
import { OrderDetail } from "../entities/order_detail.entity";
import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { mockMenuItemRepo } from "src/menu_item/tests/mocks/menuItem.mock";
import { MenuItemService } from "src/menu_item/menu_item.service";
import { Table } from "src/table/entities/table.entity";
import { TableService } from "src/table/table.service";
import { mockTable, tableId } from "src/table/tests/mocks/tableMocks";
import { TableMother } from "src/table/tests/tableMother";
import { OrderMother } from "./orderMother";
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
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '../enum/order_status';

describe("Unit OrderServices tests", () => {
    let orderService: OrderService;
    let repositories: {
        orderRepository: Repository<Order>,
        orderDetailRespostory: Repository<OrderDetail>,
    }
    let menuItemService: MenuItemService;
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
                JwtModule.register({
                    secret: 'secret123',
                    signOptions: { expiresIn: '1h' },
                }),
            ],
            providers: [
                OrderService,
                TableService,
                UploadService,
                UserService,
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

        orderService = module.get<OrderService>(OrderService)
        menuItemService = module.get<MenuItemService>(MenuItemService)
        repositories = {
            orderRepository: module.get<Repository<Order>>(getRepositoryToken(Order)),
            orderDetailRespostory: module.get<Repository<OrderDetail>>(getRepositoryToken(OrderDetail))
        }
    })


    it('should create a order', async () => {
        const orderDTO = OrderMother.dto()
        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...orderDTO, table, user }

        // Mocks for the table module
        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }
        mockTable.findOneBy.mockReturnValue(table)
        mockTable.createQueryBuilder.mockReturnValue(mockQueryBuilder)

        // Mocks for the menuItems module
        const menuItems = orderDTO.order_details.map((item, i) => ({
            id: item.menu_item,
            ...MenuItemMother.dto(),
            ...item
        }))

        mockMenuItemService.findOne.mockImplementation((id: string) => {
            const menuItem = menuItems.find(item => item.id === id);
            return Promise.resolve(menuItem);
        });

        // Mocks for the order module
        mockManager.create.mockReturnValue(order)
        mockManager.save.mockReturnValue(order)
        mockManager.update.mockReturnValue(order)

        const response = await orderService.create(orderDTO, user);

        expect(mockManager.create).toHaveBeenCalled()
        expect(mockManager.save).toHaveBeenCalled()
        expect(response).toMatchObject(order);
    });


    it('should return all tables', async () => {
        const table = { id: tableId, ...TableMother.dto() }
        const order1 = { id: orderId, ...OrderMother.dto(), table, user }
        const order2 = { id: uuid(), ...OrderMother.dto(), table, user }


        mockOrder.find.mockReturnValue([
            order1,
            order2
        ])

        const response = await orderService.findAll({ limit: 10, offset: 0 }, user);

        expect(mockOrder.find).toHaveBeenCalled()
        expect(response).toEqual([order1, order2]);
    });

    it('should return an order', async () => {
        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...OrderMother.dto(), table, user }

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockOrder.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        mockOrder.findOneBy.mockReturnValue(order)


        const response = await orderService.findOne(tableId, user);

        expect(mockOrder.createQueryBuilder).toHaveBeenCalled()
        expect(mockOrder.findOneBy).toHaveBeenCalled()
        expect(response).toEqual(order);
    });



    it('should update a table', async () => {
        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...OrderMother.dto(), table, user }

        const dtoUpdate = {
            order_details: [
                order.order_details[0],
                {
                    ...order.order_details[1],
                    quantity: 10

                }
            ]
        }

        const updatedOrder = { ...order, ...dtoUpdate }

        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }

        mockOrder.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        mockOrder.preload.mockReturnValue(updatedOrder)
        mockOrder.findOneBy.mockReturnValue(updatedOrder)

        const menuItems = order.order_details.map((item, i) => ({
            id: item.menu_item,
            ...MenuItemMother.dto(),
            ...item
        }))

        mockMenuItemService.findOne.mockImplementation((id: string) => {
            const menuItem = menuItems.find(item => item.id === id);
            return Promise.resolve(menuItem);
        });

        const response = await orderService.update(tableId, dtoUpdate, user);


        expect(mockOrder.createQueryBuilder).toHaveBeenCalled()
        expect(mockOrder.preload).toHaveBeenCalled()
        expect(mockOrder.findOneBy).toHaveBeenCalled()
        expect([
            {
                quantity: response?.order_details[0].quantity
            },
            {
                quantity: response?.order_details[1].quantity
            }
        ]).toEqual([
            {
                quantity: updatedOrder.order_details[0].quantity
            },
            {
                quantity: updatedOrder.order_details[1].quantity
            }
        ]
        );
    });

    it('should cancell a table', async () => {

        const table = { id: tableId, ...TableMother.dto() }
        const order = { id: orderId, ...OrderMother.dto(), table, user, status: OrderStatus.PENDING }
        const mockQueryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ is_active: true })
        }
        mockOrder.findOneBy.mockReturnValue(order)
        mockOrder.createQueryBuilder.mockReturnValue(mockQueryBuilder)
        const response = await orderService.cancelOrder(orderId, user);

        expect(mockOrder.createQueryBuilder).toHaveBeenCalled()
        expect(mockOrder.update).toHaveBeenCalledWith(orderId, { status: OrderStatus.CANCELLED })
    });



})