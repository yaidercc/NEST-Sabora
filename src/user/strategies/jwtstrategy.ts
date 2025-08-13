import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { Repository } from "typeorm"
import { ConfigService } from "@nestjs/config"
import { JwtPayload } from "../interfaces/jwtInterface"
import { UnauthorizedException } from "@nestjs/common"

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get("JWT_SECRET")!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload
        const user = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.employee", "employee", "employee.is_active = :employeeActive", { employeeActive: true })
            .addSelect("user.is_active")
            .where("user.id=:id", { id })
            .getOne()
        if (!user) throw new UnauthorizedException("Token not valid")
        if (!user.is_active) throw new UnauthorizedException("User is inactive, talk with an admin")
        return user
    }
}