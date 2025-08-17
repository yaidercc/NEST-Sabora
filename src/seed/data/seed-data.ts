
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
    hiring_date: string,
}

interface Table {
    id: string,
    name: string,
    capacity: string
}

interface InitialData {
    generalRoles: GeneralRole[],
    employeeRoles: EmployeeRole[]
    user: User,
    employee: Employee,
    tables: Table[]
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
    user: {
        id: uuid(),
        full_name: "jhon doe",
        username: "jhonDoe",
        email: "jhon@gmail.com",
        password: hashSync("Jhondoe123*", genSaltSync()),
        phone: "573165482747"
    },
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

    ]

}

