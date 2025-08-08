import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleException } from 'src/common/handleErrors';
import { genSaltSync, hashSync, compareSync } from "bcrypt"
import { GeneralRole } from './entities/general_role.entity';
import { GeneralRoles } from './enums/roles';
import { validate as isUUID } from "uuid"
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtInterface';
import * as sgMail from '@sendgrid/mail'; // sgMail library to send mails with http instead of smtp
import { ConfigService } from '@nestjs/config';
import { NewPassword, RequestTempPasswordDto } from './dto/reset.password.dto';


@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService")
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GeneralRole)
    private readonly generalRoleRepository: Repository<GeneralRole>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService

  ) {
    sgMail.setApiKey(this.configService.get("SENDGRID_API_KEY")!)
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...restInfo } = createUserDto
    const generalRole = await this.findGeneralRole(GeneralRoles.client)
    try {
      const user = this.userRepository.create({
        ...restInfo,
        role: generalRole!,
        password: hashSync(password, genSaltSync()),
      })

      await this.userRepository.save(user)
      const { password: _, ...userWithoutPass } = user
      return {
        user: userWithoutPass,
        token: this.generateJWT({ id: user.id })
      };

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto
    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .leftJoinAndSelect("user.role", "role")
        .where("user.username=:username", { username })
        .getOne()

      if (!user) throw new BadRequestException("username or password are incorrect")

      const checkPassword = compareSync(password, user?.password)

      if (!checkPassword) throw new BadRequestException("username or password are incorrect")

      const { password: _, ...restUserInfo } = user
      return {
        user: restUserInfo,
        token: this.generateJWT({ id: user.id })
      }

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async requestTempPassword(requestTempPasswordDto: RequestTempPasswordDto) {
    try {
      const { email, username } = requestTempPasswordDto

      const user = await this.userRepository.findOneBy({ email, username })

      if (!user) {
        throw new NotFoundException(`User not found with the specified data.`)
      }

      const tempPassword = this.generateTempPassword()
      user.password = hashSync(tempPassword, genSaltSync());
      user.is_temporal_password = true;

      await this.userRepository.save(user)

      await sgMail.send({
        to: user.email,
        from: this.configService.get("SABORA_EMAIL")!,
        subject: 'Temporal password',
        templateId: this.configService.get("SENDGRID_TEMPLATE")!,
        dynamicTemplateData: {
          password: tempPassword
        },
      });

      return 'If the user exists, a temporary password has been sent to your email.'
    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async changePassword(newPassword: NewPassword, user: User) {
    try {
      const { password, repeatPassword } = newPassword
      if (password !== repeatPassword) {
        throw new BadRequestException("Passwords do not match")
      }

      const bdUser = await this.userRepository.preload(user)

      if (!bdUser) throw new NotFoundException("User not found")
      const { id } = user
      await this.isUserActive(id);

      bdUser.password = hashSync(password, genSaltSync());
      bdUser.is_temporal_password = false

      await this.userRepository.save(bdUser)
      return "password changed"
    } catch (error) {
      handleException(error, this.logger)
    }
  }


  async findAll() {
    const user = await this.userRepository.find()
    return user
  }

  async findOne(term: string) {
    let user: User | null = null;
    try {
      if (isUUID(term)) user = await this.userRepository.findOneBy({ id: term })
      else {
        const queryBuilder = this.userRepository.createQueryBuilder("user");
        user = await queryBuilder
          .leftJoinAndSelect("user.role", "role")
          .where("email=:term or phone=:term or full_name=:term", {
            term: term.toLowerCase(),
          }).getOne()
      }

      if (!user) throw new NotFoundException("User not found")

      return user
    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    if (!updateUserDto || typeof updateUserDto !== 'object') {
      throw new BadRequestException("No data provided to update");
    }

    const { password = null, ...toUpdate } = updateUserDto

    const user = await this.userRepository.preload({
      id,
      ...toUpdate
    })

    if (!user) throw new NotFoundException("User not found")

    await this.isUserActive(id);

    try {
      await this.userRepository.save(user)
      return await this.findOne(id)
    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async remove(id: string) {
    return await this.userRepository.update(id, { is_active: false })
  }

  generateJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload)
  }

  async removeAllUsers() {
    const queryBuilder = await this.userRepository.createQueryBuilder()
    queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async findGeneralRole(term: string) {
    let role: GeneralRole | null = null;
    if (isUUID(term)) role = await this.generalRoleRepository.findOneBy({ id: term })
    else role = await this.generalRoleRepository.findOneBy({ name: term })

    if (!role) {
      throw new BadRequestException("general role not found")
    }

    return role
  }


  private generateTempPassword(length: number = 12) {
    let password: string = "";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lower = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?"
    const all = upper + lower + numbers + symbols;
    const getRandom = (char: string) => char[Math.floor(Math.random() * char.length)];

    password += getRandom(upper)
    password += getRandom(lower)
    password += getRandom(numbers)
    password += getRandom(symbols)

    for (let i = 3; i < length; i++) {
      password += getRandom(all);
    }

    return password;
  }

  private async isUserActive(id: string) {

    const isUserActive = 
      await this.userRepository
      .createQueryBuilder("user")
      .select("user.is_active")
      .where("user.id=:id", { id })
      .getRawOne()
      // getOne() is not useful in this case 'cause i need just one attr not the whole entity

    if (isUserActive?.is_active) throw new NotFoundException("User is inactive talk with the admin")
  }
}
