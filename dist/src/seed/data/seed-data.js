"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialData = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const roles_1 = require("../../common/enums/roles");
const menu_item_type_1 = require("../../menu_item/enum/menu_item_type");
exports.initialData = {
    generalRoles: [
        {
            id: (0, uuid_1.v4)(),
            name: roles_1.GeneralRoles.ADMIN
        },
        {
            id: (0, uuid_1.v4)(),
            name: roles_1.GeneralRoles.EMPLOYEE
        },
        {
            id: (0, uuid_1.v4)(),
            name: roles_1.GeneralRoles.CLIENT
        },
    ],
    employeeRoles: [
        {
            id: (0, uuid_1.v4)(),
            name: roles_1.EmployeeRoles.MANAGER
        },
        {
            id: (0, uuid_1.v4)(),
            name: roles_1.EmployeeRoles.CASHIER
        },
        {
            id: (0, uuid_1.v4)(),
            name: roles_1.EmployeeRoles.WAITRESS
        },
        {
            id: (0, uuid_1.v4)(),
            name: roles_1.EmployeeRoles.COOKER
        },
    ],
    user: [
        {
            id: (0, uuid_1.v4)(),
            full_name: "jhon doe",
            username: "jhonDoe",
            email: "jhon@gmail.com",
            password: (0, bcrypt_1.hashSync)("Jhondoe123*", (0, bcrypt_1.genSaltSync)()),
            phone: "573165482747"
        },
        {
            id: (0, uuid_1.v4)(),
            full_name: "jane doe",
            username: "janeDoe",
            email: "jane@gmail.com",
            password: (0, bcrypt_1.hashSync)("Janedoe123*", (0, bcrypt_1.genSaltSync)()),
            phone: "573238374625"
        }
    ],
    employee: {
        id: (0, uuid_1.v4)(),
        hiring_date: "2020-10-10",
    },
    tables: [
        {
            id: (0, uuid_1.v4)(),
            name: "001",
            capacity: 4
        },
        {
            id: (0, uuid_1.v4)(),
            name: "002",
            capacity: 2
        },
        {
            id: (0, uuid_1.v4)(),
            name: "003",
            capacity: 1
        },
        {
            id: (0, uuid_1.v4)(),
            name: "004",
            capacity: 3
        },
        {
            id: (0, uuid_1.v4)(),
            name: "005",
            capacity: 7
        },
    ],
    schedule: [
        {
            id: (0, uuid_1.v4)(),
            day_of_week: 0,
            is_closed: true,
        },
        {
            id: (0, uuid_1.v4)(),
            day_of_week: 1,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: (0, uuid_1.v4)(),
            day_of_week: 2,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: (0, uuid_1.v4)(),
            day_of_week: 3,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: (0, uuid_1.v4)(),
            day_of_week: 4,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: (0, uuid_1.v4)(),
            day_of_week: 5,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: (0, uuid_1.v4)(),
            day_of_week: 6,
            opening_time: "08:00:00",
            closing_time: "19:00:00",
            is_closed: false,
        }
    ],
    menuItem: [
        {
            id: (0, uuid_1.v4)(),
            name: "Pescado frito",
            description: "Trucha frita con patacones, ensalada, sopa y arroz de coco",
            price: 25.000,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756779868/download_qniu9a.jpg",
            menu_item_type: menu_item_type_1.MenuItemType.MAIN_COURSE
        },
        {
            id: (0, uuid_1.v4)(),
            name: "Platano maduro con queso",
            description: "Platano maduro asado con queso costeño y salsa de guayaba",
            price: 10.000,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756780023/YDL4S37FUZCFLD2AVYYG75FOV4_cqgecq.avif",
            menu_item_type: menu_item_type_1.MenuItemType.DESSERT
        },
        {
            id: (0, uuid_1.v4)(),
            name: "Jugos en leche",
            description: "Jugo de mora, mango, piña, banano y guayaba",
            price: 4.500,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756780138/jugos-naturales-1-1_ps3a5j.jpg",
            menu_item_type: menu_item_type_1.MenuItemType.BEVERAGE
        },
        {
            id: (0, uuid_1.v4)(),
            name: "Frijoles con chicharron",
            description: "Deliciosos frijoles con trocitos de chicharron carnudo",
            price: 4.500,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756780162/260-image_web.jpg_bgcvak.webp",
            menu_item_type: menu_item_type_1.MenuItemType.BEVERAGE
        },
    ]
};
//# sourceMappingURL=seed-data.js.map