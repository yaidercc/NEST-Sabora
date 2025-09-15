"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const env_config_1 = require("./config/env.config");
const joi_validation_1 = require("./config/joi.validation");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const seed_module_1 = require("./seed/seed.module");
const mailer_1 = require("@nestjs-modules/mailer");
const employee_module_1 = require("./employee/employee.module");
const table_module_1 = require("./table/table.module");
const reservation_module_1 = require("./reservation/reservation.module");
const menu_item_module_1 = require("./menu_item/menu_item.module");
const order_module_1 = require("./order/order.module");
const invoice_module_1 = require("./invoice/invoice.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [env_config_1.EnvConfiguration],
                validationSchema: joi_validation_1.JoiEnvValidation
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                database: process.env.DB_NAME,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                autoLoadEntities: true,
                synchronize: true
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SENDGRID_API_KEY,
                    },
                },
                defaults: {
                    from: '"Sabora 🍽️" <app.sabora.rest@gmail.com>',
                },
            }),
            user_module_1.UserModule,
            seed_module_1.SeedModule,
            employee_module_1.EmployeeModule,
            table_module_1.TableModule,
            reservation_module_1.ReservationModule,
            menu_item_module_1.MenuItemModule,
            order_module_1.OrderModule,
            invoice_module_1.InvoiceModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map