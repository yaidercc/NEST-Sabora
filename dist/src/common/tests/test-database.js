"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDatabaseManager = void 0;
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const env_config_1 = require("../../config/env.config");
const joi_validation_1 = require("../../config/joi.validation");
const employee_module_1 = require("../../employee/employee.module");
const employee_service_1 = require("../../employee/employee.service");
const employee_entity_1 = require("../../employee/entities/employee.entity");
const employee_role_entity_1 = require("../../employee/entities/employee_role.entity");
const seed_module_1 = require("../../seed/seed.module");
const seed_service_1 = require("../../seed/seed.service");
const table_entity_1 = require("../../table/entities/table.entity");
const table_module_1 = require("../../table/table.module");
const table_service_1 = require("../../table/table.service");
const general_role_entity_1 = require("../../user/entities/general_role.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const user_module_1 = require("../../user/user.module");
const schedule_entity_1 = require("../../reservation/entities/schedule.entity");
const reservation_entity_1 = require("../../reservation/entities/reservation.entity");
const reservation_module_1 = require("../../reservation/reservation.module");
const reservation_service_1 = require("../../reservation/reservation.service");
const menu_item_service_1 = require("../../menu_item/menu_item.service");
const menu_item_module_1 = require("../../menu_item/menu_item.module");
const menu_item_entity_1 = require("../../menu_item/entities/menu_item.entity");
const common_module_1 = require("../common.module");
const order_entity_1 = require("../../order/entities/order.entity");
const order_detail_entity_1 = require("../../order/entities/order_detail.entity");
const order_module_1 = require("../../order/order.module");
const order_service_1 = require("../../order/order.service");
const invoice_entity_1 = require("../../invoice/entities/invoice.entity");
const invoice_module_1 = require("../../invoice/invoice.module");
const invoice_service_1 = require("../../invoice/invoice.service");
class TestDatabaseManager {
    static module;
    static app;
    static initialized = false;
    static async initializeE2E() {
        if (!this.initialized) {
            this.module = await testing_1.Test.createTestingModule({
                imports: [
                    config_1.ConfigModule.forRoot({
                        envFilePath: ".env.test",
                        load: [env_config_1.EnvConfiguration],
                        validationSchema: joi_validation_1.JoiEnvValidation
                    }),
                    typeorm_1.TypeOrmModule.forRoot({
                        type: "postgres",
                        host: "localhost",
                        port: +process.env.DB_PORT,
                        database: process.env.DB_NAME,
                        username: process.env.DB_USERNAME,
                        password: process.env.DB_PASSWORD,
                        entities: [user_entity_1.User, general_role_entity_1.GeneralRole, employee_entity_1.Employee, employee_role_entity_1.EmployeeRole, table_entity_1.Table, schedule_entity_1.Schedule, reservation_entity_1.Reservation, menu_item_entity_1.MenuItem, order_entity_1.Order, order_detail_entity_1.OrderDetail, invoice_entity_1.Invoice],
                        synchronize: true,
                        dropSchema: true
                    }),
                    user_module_1.UserModule,
                    seed_module_1.SeedModule,
                    employee_module_1.EmployeeModule,
                    table_module_1.TableModule,
                    reservation_module_1.ReservationModule,
                    menu_item_module_1.MenuItemModule,
                    common_module_1.CommonModule,
                    order_module_1.OrderModule,
                    invoice_module_1.InvoiceModule
                ],
                providers: [employee_service_1.EmployeeService, jwt_1.JwtService, seed_service_1.SeedService, table_service_1.TableService, reservation_service_1.ReservationService, menu_item_service_1.MenuItemService, order_service_1.OrderService, invoice_service_1.InvoiceService]
            }).compile();
            this.app = this.module.createNestApplication();
            await this.app.init();
            const seedService = this.module.get(seed_service_1.SeedService);
            await seedService.executeSEED();
        }
        return {
            module: this.module,
            app: this.app,
        };
    }
    static async initializeInt() {
        this.module = await testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({
                    envFilePath: ".env.test",
                    load: [env_config_1.EnvConfiguration],
                    validationSchema: joi_validation_1.JoiEnvValidation
                }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: ":memory:",
                    entities: [employee_entity_1.Employee, employee_role_entity_1.EmployeeRole, user_entity_1.User, general_role_entity_1.GeneralRole, table_entity_1.Table, schedule_entity_1.Schedule, reservation_entity_1.Reservation, menu_item_entity_1.MenuItem, order_entity_1.Order, order_detail_entity_1.OrderDetail, invoice_entity_1.Invoice],
                    synchronize: true,
                    dropSchema: true,
                    extra: {
                        pragma: "FOREIGN_KEYS=ON;"
                    }
                }),
                typeorm_1.TypeOrmModule.forFeature([employee_entity_1.Employee, employee_role_entity_1.EmployeeRole, user_entity_1.User, general_role_entity_1.GeneralRole, table_entity_1.Table, schedule_entity_1.Schedule, reservation_entity_1.Reservation, menu_item_entity_1.MenuItem, order_entity_1.Order, order_detail_entity_1.OrderDetail, invoice_entity_1.Invoice]),
                employee_module_1.EmployeeModule,
                user_module_1.UserModule,
                table_module_1.TableModule,
                reservation_module_1.ReservationModule,
                menu_item_module_1.MenuItemModule,
                common_module_1.CommonModule,
                order_module_1.OrderModule,
                invoice_module_1.InvoiceModule
            ],
            providers: [employee_service_1.EmployeeService, jwt_1.JwtService, seed_service_1.SeedService, table_service_1.TableService, reservation_service_1.ReservationService, menu_item_service_1.MenuItemService, order_service_1.OrderService, invoice_service_1.InvoiceService]
        }).compile();
        const dataSource = this.module.get(typeorm_2.DataSource);
        await dataSource.query('PRAGMA foreign_keys = ON;');
        const seedService = this.module.get(seed_service_1.SeedService);
        await seedService.executeSEED();
        return this.module;
    }
    static async cleanUp() {
        if (this.app) {
            await this.app.close();
            this.initialized = false;
        }
    }
}
exports.TestDatabaseManager = TestDatabaseManager;
//# sourceMappingURL=test-database.js.map