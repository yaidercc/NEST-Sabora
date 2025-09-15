"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const seed_service_1 = require("./seed.service");
const seed_controller_1 = require("./seed.controller");
const user_module_1 = require("../user/user.module");
const employee_module_1 = require("../employee/employee.module");
const table_module_1 = require("../table/table.module");
const reservation_module_1 = require("../reservation/reservation.module");
const menu_item_module_1 = require("../menu_item/menu_item.module");
const order_module_1 = require("../order/order.module");
const invoice_module_1 = require("../invoice/invoice.module");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        controllers: [seed_controller_1.SeedController],
        providers: [seed_service_1.SeedService],
        imports: [user_module_1.UserModule, employee_module_1.EmployeeModule, table_module_1.TableModule, reservation_module_1.ReservationModule, menu_item_module_1.MenuItemModule, order_module_1.OrderModule, invoice_module_1.InvoiceModule],
        exports: [seed_service_1.SeedService]
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map