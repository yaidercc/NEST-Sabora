
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

interface InitialData {
    generalRoles: GeneralRole[],
    employeeRoles: EmployeeRole[]
    user: User,
    employee: Employee
}

export const initialData: InitialData = {
    generalRoles: [
        {
            id: uuid(),
            name: GeneralRoles.admin
        },
        {
            id: uuid(),
            name: GeneralRoles.employee
        },
        {
            id: uuid(),
            name: GeneralRoles.client
        },
    ],
    employeeRoles: [
        {
            id: uuid(),
            name: EmployeeRoles.cashier
        },
        {
            id: uuid(),
            name: EmployeeRoles.waitress
        },
        {
            id: uuid(),
            name: EmployeeRoles.cooker
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
    employee:{
        id: uuid(),
        hiring_date: "2020-10-10",
    }

}

