"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const typeorm_2 = require("typeorm");
const employee_role_entity_1 = require("./entities/employee_role.entity");
const handleErrors_1 = require("../common/helpers/handleErrors");
const user_entity_1 = require("../user/entities/user.entity");
const uuid_1 = require("uuid");
const isActive_1 = require("../common/helpers/isActive");
const general_role_entity_1 = require("../user/entities/general_role.entity");
const roles_1 = require("../common/enums/roles");
const findRole_1 = require("../common/helpers/findRole");
let EmployeeService = class EmployeeService {
    employeeRepository;
    employeeRoleRepository;
    userRepository;
    generalRoleRepository;
    dataSource;
    logger = new common_1.Logger("EmployeeService");
    constructor(employeeRepository, employeeRoleRepository, userRepository, generalRoleRepository, dataSource) {
        this.employeeRepository = employeeRepository;
        this.employeeRoleRepository = employeeRoleRepository;
        this.userRepository = userRepository;
        this.generalRoleRepository = generalRoleRepository;
        this.dataSource = dataSource;
    }
    async create(createEmployeeDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            queryRunner.startTransaction();
            const user = await queryRunner.manager.findOneBy(user_entity_1.User, { id: createEmployeeDto.user_id });
            if (!user)
                throw new common_1.NotFoundException(`User not found`);
            const existsEmployee = await queryRunner.manager.findOneBy(employee_entity_1.Employee, { user: user });
            if (existsEmployee)
                throw new common_1.ConflictException('User already exits as an employee');
            const employee_role = await queryRunner.manager.findOneBy(employee_role_entity_1.EmployeeRole, { id: createEmployeeDto.employee_role_id });
            if (!employee_role)
                throw new common_1.NotFoundException(`Employee role not found`);
            const role = await (0, findRole_1.findGeneralRole)(roles_1.GeneralRoles.EMPLOYEE, this.generalRoleRepository);
            await this.userRepository.update(user.id, { role });
            const employee = queryRunner.manager.create(employee_entity_1.Employee, {
                ...createEmployeeDto,
                user,
                employee_role,
            });
            await queryRunner.manager.save(employee_entity_1.Employee, employee);
            await queryRunner.commitTransaction();
            return employee;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            (0, handleErrors_1.handleException)(error, this.logger);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(pagination) {
        const { limit = 10, offset = 0 } = pagination;
        return await this.employeeRepository.find({
            take: limit,
            skip: offset,
            relations: {
                user: true,
                employee_role: true
            },
            where: { is_active: true }
        });
    }
    async findOne(term) {
        let employee = null;
        if ((0, uuid_1.validate)(term)) {
            const queryBuilder = await this.employeeRepository.createQueryBuilder("employee");
            employee = await queryBuilder
                .leftJoinAndSelect("employee.employee_role", "employee_role")
                .leftJoinAndSelect("employee.user", "user")
                .where("employee.id=:term or employee.user=:term", {
                term,
            })
                .andWhere("employee.is_active=:is_active", { is_active: true })
                .getOne();
        }
        if (!employee)
            throw new common_1.NotFoundException("Employee not found");
        return employee;
    }
    async update(id, updateEmployeeDto) {
        try {
            if (!updateEmployeeDto || typeof updateEmployeeDto !== 'object') {
                throw new common_1.BadRequestException("No data provided to update");
            }
            const { employee_role_id = "", ...toUpdate } = updateEmployeeDto;
            const employee = await this.employeeRepository.preload({
                id,
                ...updateEmployeeDto
            });
            if (!employee)
                throw new common_1.NotFoundException("Employee not found");
            const is_active = await (0, isActive_1.isActive)(id, this.employeeRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("Employee is not available");
            }
            if (toUpdate.user_id) {
                const findRepeatEmployee = await this.employeeRepository.findOne({
                    where: {
                        user: {
                            id: toUpdate.user_id
                        },
                        id: (0, typeorm_2.Not)(id)
                    }
                });
                if (findRepeatEmployee) {
                    throw new common_1.ConflictException('User already exits as an employee');
                }
            }
            if (employee_role_id.trim()) {
                const employee_role = await this.employeeRoleRepository.findOneBy({ id: employee_role_id });
                if (!employee_role)
                    throw new common_1.NotFoundException("The specified employee role does not exists");
                employee.employee_role = employee_role;
            }
            await this.employeeRepository.save(employee);
            return await this.findOne(id);
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async remove(id) {
        try {
            const employee = await this.employeeRepository.findOneBy({ id });
            if (!employee)
                throw new common_1.NotFoundException("Employee not found");
            const is_active = await (0, isActive_1.isActive)(id, this.employeeRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("Employee is not available");
            }
            const clientRole = await this.generalRoleRepository.findOneBy({ name: roles_1.GeneralRoles.CLIENT });
            await this.userRepository.update(id, { role: clientRole });
            return await this.employeeRepository.update(id, { is_active: false });
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async removeAllEmployees() {
        const queryBuilder = this.employeeRepository.createQueryBuilder();
        await queryBuilder
            .delete()
            .where({})
            .execute();
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_role_entity_1.EmployeeRole)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(general_role_entity_1.GeneralRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map