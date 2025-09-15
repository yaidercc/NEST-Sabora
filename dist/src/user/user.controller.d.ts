import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { GeneralRole } from './entities/general_role.entity';
import { NewPassword, RequestTempPasswordDto } from './dto/reset.password.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
            employee?: import("../employee/entities/employee.entity").Employee;
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
            employee?: import("../employee/entities/employee.entity").Employee;
            reservation: import("../reservation/entities/reservation.entity").Reservation;
            order: import("../order/entities/order.entity").Order;
        };
        token: string;
    } | undefined>;
    findAll(): Promise<User[]>;
    sendEmailToResetPassword(requestTempPasswordDto: RequestTempPasswordDto): Promise<"If the user exists, a temporary password has been sent to your email." | undefined>;
    changePassword(newPassword: NewPassword, user: User): Promise<"password changed" | undefined>;
    profile(user: any): any;
    findOne(term: string): Promise<User | undefined>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
}
