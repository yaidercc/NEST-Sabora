import { Repository } from "typeorm";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { EmployeeRole } from "../entities/employee_role.entity";
import { EmployeeService } from "../employee.service";
import { Employee } from "../entities/employee.entity";
import { UserService } from "src/user/user.service";
import { UserMother } from "src/user/tests/userMother";
import { CreateMenuItemDto } from "../dto/create-menu_item.dto";
import { MenuItemType } from "../enum/menu_item_type";
import { MenuItemService } from "../menu_item.service";

export class MenuItemMother {
    static dto(menuItemInfo?: Partial<CreateMenuItemDto>): CreateMenuItemDto {
        return {
            name: menuItemInfo?.name ?? "Sancocho",
            description: menuItemInfo?.description ?? "Delicioso sancocho tradicional colombiano",
            price: menuItemInfo?.price ?? 25000,
            menu_item_type: menuItemInfo?.menu_item_type ?? MenuItemType.MAIN_COURSE
        };
    }




    static async createManyMenuItems(menuItemService: MenuItemService, quantity: number): Promise<MenuItemService[]> {
        const users = await UserMother.createManyUsers(userService, quantity)
        const randomEmployeeRole = () => Object.values(employeeRoles)[Math.floor(Math.random() * Object.values(employeeRoles).length)]
        let employees: Employee[] = [];

        for (let i = 0; i < quantity; i++) {
            const employee = await menuItemService.create(MenuItemMother.dto({
                user_id: users[i].user.id,
                employee_role_id: randomEmployeeRole()
            }))
            if (employee) {
                employees.push(employee)
            }
        }
        return employees
    }

}
