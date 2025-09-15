"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeMother = void 0;
const userMother_1 = require("../../user/tests/userMother");
class EmployeeMother {
    static dto(employeeInfo) {
        return {
            user_id: employeeInfo?.user_id ?? "6c339bfd-c7d2-4bea-9eaf-be4ab0393946",
            employee_role_id: employeeInfo?.employee_role_id ?? "f0f82af0-0842-4873-8304-d618d704ffe9",
            hiring_date: employeeInfo?.hiring_date ?? "2020-10-10",
        };
    }
    static async employeeRolesIds(employeeRepository) {
        const employeeRoles = await employeeRepository.find();
        const rolesIds = {};
        employeeRoles.forEach((item) => rolesIds[item.name] = item.id);
        return rolesIds;
    }
    static async createManyEmployees(employeeService, userService, quantity, employeeRoles) {
        const users = await userMother_1.UserMother.createManyUsers(userService, quantity);
        const randomEmployeeRole = () => Object.values(employeeRoles)[Math.floor(Math.random() * Object.values(employeeRoles).length)];
        let employees = [];
        for (let i = 0; i < quantity; i++) {
            const employee = await employeeService.create(EmployeeMother.dto({
                user_id: users[i].user.id,
                employee_role_id: randomEmployeeRole()
            }));
            if (employee) {
                employees.push(employee);
            }
        }
        return employees;
    }
}
exports.EmployeeMother = EmployeeMother;
//# sourceMappingURL=employeeMother.js.map