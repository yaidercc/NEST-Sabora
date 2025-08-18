
import { v4 as uuid } from "uuid"
import { genSaltSync, hashSync } from "bcrypt"
import { EmployeeRoles, GeneralRoles } from "src/common/enums/roles"

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
    capacity: string
}

interface Schedule {
    id: string;
    day_of_week: number;
    opening_time?: string;
    closing_time?: string;
    is_closed: boolean;
}

interface InitialData {
    generalRoles: GeneralRole[],
    employeeRoles: EmployeeRole[]
    user: User[],
    employee: Employee,
    tables: Table[],
    schedule: Schedule[]
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
            capacity: "4"
        },
        {
            id: uuid(),
            name: "002",
            capacity: "2"
        },
        {
            id: uuid(),
            name: "003",
            capacity: "1"
        },
        {
            id: uuid(),
            name: "004",
            capacity: "3"
        },
        {
            id: uuid(),
            name: "005",
            capacity: "7"
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
    ]

}

