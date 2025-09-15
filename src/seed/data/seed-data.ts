
import { v4 as uuid } from "uuid"
import { genSaltSync, hashSync } from "bcrypt"
import { EmployeeRoles, GeneralRoles } from "src/common/enums/roles"
import { MenuItemType } from "src/menu_item/enum/menu_item_type"

interface GeneralRole {
    id: string,
    name: string
}

export interface EmployeeRole {
    id: string,
    name: string
}

interface User {
    id: string,
    full_name: string,
    username: string,
    email: string,
    password: string,
    phone: string
}

interface Employee {
    id: string,
    user?: User,
    employee_role?: EmployeeRole,
    hiring_date: string,
}

interface Table {
    id: string,
    name: string,
    capacity: number
}

interface Schedule {
    id: string;
    day_of_week: number;
    opening_time?: string;
    closing_time?: string;
    is_closed: boolean;
}

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    menu_item_type: string;
}

interface InitialData {
    generalRoles: GeneralRole[],
    employeeRoles: EmployeeRole[]
    user: User[],
    employee: Employee,
    tables: Table[],
    schedule: Schedule[],
    menuItem: MenuItem[],
}

export const initialData: InitialData = {
    generalRoles: [
        {
            id: uuid(),
            name: GeneralRoles.ADMIN
        },
        {
            id: uuid(),
            name: GeneralRoles.EMPLOYEE
        },
        {
            id: uuid(),
            name: GeneralRoles.CLIENT
        },
    ],
    employeeRoles: [
        {
            id: uuid(),
            name: EmployeeRoles.MANAGER
        },
        {
            id: uuid(),
            name: EmployeeRoles.CASHIER
        },
        {
            id: uuid(),
            name: EmployeeRoles.WAITRESS
        },
        {
            id: uuid(),
            name: EmployeeRoles.COOKER
        },

    ],
    
    user: [
        {
            id: uuid(),
            full_name: "jhon doe",
            username: "jhonDoe",
            email: "jhon@gmail.com",
            password: hashSync("Jhondoe123*", genSaltSync()),
            phone: "573165482747"
        },
        {
            id: uuid(),
            full_name: "jane doe",
            username: "janeDoe",
            email: "jane@gmail.com",
            password: hashSync("Janedoe123*", genSaltSync()),
            phone: "573238374625"
        }
    ],
    employee: {
        id: uuid(),
        hiring_date: "2020-10-10",
    },
    tables: [
        {
            id: uuid(),
            name: "001",
            capacity: 4
        },
        {
            id: uuid(),
            name: "002",
            capacity: 2
        },
        {
            id: uuid(),
            name: "003",
            capacity: 1
        },
        {
            id: uuid(),
            name: "004",
            capacity: 3
        },
        {
            id: uuid(),
            name: "005",
            capacity: 7
        },

    ],
    schedule: [
        {
            id: uuid(),
            day_of_week: 0,
            is_closed: true,
        },
        {
            id: uuid(),
            day_of_week: 1,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: uuid(),
            day_of_week: 2,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: uuid(),
            day_of_week: 3,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: uuid(),
            day_of_week: 4,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: uuid(),
            day_of_week: 5,
            opening_time: "08:00:00",
            closing_time: "22:00:00",
            is_closed: false,
        },
        {
            id: uuid(),
            day_of_week: 6,
            opening_time: "08:00:00",
            closing_time: "19:00:00",
            is_closed: false,
        }
    ],
    menuItem: [
        {
            id: uuid(),
            name: "Pescado frito",
            description:"Trucha frita con patacones, ensalada, sopa y arroz de coco",
            price:  25.000,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756779868/download_qniu9a.jpg",
            menu_item_type: MenuItemType.MAIN_COURSE
        },
        {
            id: uuid(),
            name: "Platano maduro con queso",
            description:"Platano maduro asado con queso costeño y salsa de guayaba",
            price:  10.000,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756780023/YDL4S37FUZCFLD2AVYYG75FOV4_cqgecq.avif",
            menu_item_type: MenuItemType.DESSERT
        },
        {
            id: uuid(),
            name: "Jugos en leche",
            description:"Jugo de mora, mango, piña, banano y guayaba",
            price:  4.500,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756780138/jugos-naturales-1-1_ps3a5j.jpg",
            menu_item_type: MenuItemType.BEVERAGE
        },
        {
            id: uuid(),
            name: "Frijoles con chicharron",
            description:"Deliciosos frijoles con trocitos de chicharron carnudo",
            price:  4.500,
            image: "https://res.cloudinary.com/dwbldpfvx/image/upload/v1756780162/260-image_web.jpg_bgcvak.webp",
            menu_item_type: MenuItemType.BEVERAGE
        },
    ]

}

