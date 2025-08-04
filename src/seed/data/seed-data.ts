import { GeneralRoles } from "src/user/enums/roles"
import { v4 as uuid } from "uuid"
import { genSaltSync, hashSync } from "bcrypt"

interface GeneralRole {
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

interface InitialData {
    generalRoles: GeneralRole[],
    user: User
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
    user: {
        id: uuid(),
        full_name: "jhon doe",
        username: "jhonDoe",
        email: "jhon@gmail.com",
        password: hashSync("Jhondoe123*", genSaltSync()),
        phone: "573165482747"
    }

}

