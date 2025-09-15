import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { GeneralRole } from './entities/general_role.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtInterface';
import { ConfigService } from '@nestjs/config';
import { NewPassword, RequestTempPasswordDto } from './dto/reset.password.dto';
import { Employee } from 'src/employee/entities/employee.entity';
export declare class UserService {
    private readonly userRepository;
    private readonly generalRoleRepository;
    private readonly employeeRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(userRepository: Repository<User>, generalRoleRepository: Repository<GeneralRole>, employeeRepository: Repository<Employee>, jwtService: JwtService, configService: ConfigService);
    create(createUserDto: CreateUserDto): Promise<{
        user: {
            id: string;
            full_name: string;
            username: string;
            email: string;
            phone: string;
            is_active: boolean;
            is_temporal_password: boolean;
            role: GeneralRole;
            employee?: Employee;
            reservation: import("../reservation/entities/reservation.entity").Reservation;
            order: import("../order/entities/order.entity").Order;
        };
        token: string;
    } | undefined>;
    login(loginUserDto: LoginUserDto): Promise<{
        user: {
            id: string;
            full_name: string;
            username: string;
            email: string;
            phone: string;
            is_active: boolean;
            is_temporal_password: boolean;
            role: GeneralRole;
            employee?: Employee;
            reservation: import("../reservation/entities/reservation.entity").Reservation;
            order: import("../order/entities/order.entity").Order;
        };
        token: string;
    } | undefined>;
    requestTempPassword(requestTempPasswordDto: RequestTempPasswordDto): Promise<"If the user exists, a temporary password has been sent to your email." | undefined>;
    changePassword(newPassword: NewPassword, user: User): Promise<"password changed" | undefined>;
    findAll(): Promise<User[]>;
    findOne(term: string): Promise<User | undefined>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
    generateJWT(payload: JwtPayload): string;
    removeAllUsers(): Promise<void>;
    private generateTempPassword;
}
