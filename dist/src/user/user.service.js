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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const handleErrors_1 = require("../common/helpers/handleErrors");
const bcrypt_1 = require("bcrypt");
const general_role_entity_1 = require("./entities/general_role.entity");
const uuid_1 = require("uuid");
const jwt_1 = require("@nestjs/jwt");
const sgMail = require("@sendgrid/mail");
const config_1 = require("@nestjs/config");
const roles_1 = require("../common/enums/roles");
const isActive_1 = require("../common/helpers/isActive");
const employee_entity_1 = require("../employee/entities/employee.entity");
const findRole_1 = require("../common/helpers/findRole");
let UserService = class UserService {
    userRepository;
    generalRoleRepository;
    employeeRepository;
    jwtService;
    configService;
    logger = new common_1.Logger("UserService");
    constructor(userRepository, generalRoleRepository, employeeRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.generalRoleRepository = generalRoleRepository;
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        sgMail.setApiKey(this.configService.get("SENDGRID_API_KEY"));
    }
    async create(createUserDto) {
        const { password, role = "", ...restInfo } = createUserDto;
        const generalRole = await (0, findRole_1.findGeneralRole)(roles_1.GeneralRoles.CLIENT, this.generalRoleRepository);
        try {
            const user = this.userRepository.create({
                ...restInfo,
                role: generalRole,
                password: (0, bcrypt_1.hashSync)(password, (0, bcrypt_1.genSaltSync)()),
            });
            await this.userRepository.save(user);
            const { password: _, ...userWithoutPass } = user;
            return {
                user: userWithoutPass,
                token: this.generateJWT({ id: user.id })
            };
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async login(loginUserDto) {
        const { username, password } = loginUserDto;
        try {
            const user = await this.userRepository
                .createQueryBuilder("user")
                .addSelect("user.password")
                .leftJoinAndSelect("user.role", "role")
                .where("user.username=:username", { username })
                .getOne();
            if (!user)
                throw new common_1.BadRequestException("username or password are incorrect");
            const checkPassword = (0, bcrypt_1.compareSync)(password, user?.password);
            if (!checkPassword)
                throw new common_1.BadRequestException("username or password are incorrect");
            const { password: _, ...restUserInfo } = user;
            return {
                user: restUserInfo,
                token: this.generateJWT({ id: user.id })
            };
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async requestTempPassword(requestTempPasswordDto) {
        try {
            const { email, username } = requestTempPasswordDto;
            const user = await this.userRepository.findOneBy({ email, username });
            if (!user) {
                throw new common_1.NotFoundException(`User not found with the specified data.`);
            }
            const tempPassword = this.generateTempPassword();
            user.password = (0, bcrypt_1.hashSync)(tempPassword, (0, bcrypt_1.genSaltSync)());
            user.is_temporal_password = true;
            await this.userRepository.save(user);
            await sgMail.send({
                to: user.email,
                from: this.configService.get("SABORA_EMAIL"),
                subject: 'Temporal password',
                templateId: this.configService.get("SENDGRID_TEMPLATE"),
                dynamicTemplateData: {
                    password: tempPassword
                },
            });
            return 'If the user exists, a temporary password has been sent to your email.';
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async changePassword(newPassword, user) {
        try {
            const { password, repeatPassword } = newPassword;
            if (password !== repeatPassword) {
                throw new common_1.BadRequestException("Passwords do not match");
            }
            const bdUser = await this.userRepository.preload(user);
            if (!bdUser)
                throw new common_1.NotFoundException("User not found");
            const { id } = user;
            const is_active = await (0, isActive_1.isActive)(id, this.userRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("User is not available");
            }
            bdUser.password = (0, bcrypt_1.hashSync)(password, (0, bcrypt_1.genSaltSync)());
            bdUser.is_temporal_password = false;
            await this.userRepository.save(bdUser);
            return "password changed";
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async findAll() {
        const user = await this.userRepository.find();
        return user;
    }
    async findOne(term) {
        let user = null;
        try {
            if ((0, uuid_1.validate)(term))
                user = await this.userRepository.findOneBy({ id: term });
            else {
                const queryBuilder = this.userRepository.createQueryBuilder("user");
                user = await queryBuilder
                    .leftJoinAndSelect("user.role", "role")
                    .where("(LOWER(email) = :term OR LOWER(phone) = :term OR LOWER(full_name) = :term OR LOWER(username) = :term)", { term: term.toLowerCase() })
                    .addSelect("user.is_active")
                    .getOne();
            }
            if (!user)
                throw new common_1.NotFoundException("User not found");
            const is_active = await (0, isActive_1.isActive)(user.id, this.userRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("User is not available");
            }
            return user;
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async update(id, updateUserDto) {
        try {
            if (!updateUserDto || typeof updateUserDto !== 'object') {
                throw new common_1.BadRequestException("No data provided to update");
            }
            const { password = null, role: roleId = "", ...toUpdate } = updateUserDto;
            const user = await this.userRepository.preload({
                id,
                ...toUpdate
            });
            if (!user)
                throw new common_1.NotFoundException("User not found");
            const is_active = await (0, isActive_1.isActive)(id, this.userRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("User is not available");
            }
            if (roleId.trim()) {
                const role = await this.generalRoleRepository.findOneBy({ id: roleId });
                if (!role)
                    throw new common_1.NotFoundException("The specified role does not exists");
                user.role = role;
            }
            await this.userRepository.save(user);
            return await this.findOne(id);
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async remove(id) {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user)
                throw new common_1.NotFoundException("User not found");
            const is_active = await (0, isActive_1.isActive)(id, this.userRepository);
            if (!is_active) {
                throw new common_1.BadRequestException("User is not available");
            }
            if (user.employee)
                await this.employeeRepository.update(id, { is_active: false });
            return await this.userRepository.update(id, { is_active: false });
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    generateJWT(payload) {
        return this.jwtService.sign(payload);
    }
    async removeAllUsers() {
        const queryBuilder = this.userRepository.createQueryBuilder();
        await queryBuilder
            .delete()
            .where({})
            .execute();
    }
    generateTempPassword(length = 12) {
        let password = "";
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
        const all = upper + lower + numbers + symbols;
        const getRandom = (char) => char[Math.floor(Math.random() * char.length)];
        password += getRandom(upper);
        password += getRandom(lower);
        password += getRandom(numbers);
        password += getRandom(symbols);
        for (let i = 3; i < length; i++) {
            password += getRandom(all);
        }
        return password;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(general_role_entity_1.GeneralRole)),
    __param(2, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map