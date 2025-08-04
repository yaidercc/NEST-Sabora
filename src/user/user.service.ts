import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleException } from 'src/common/handleErrors';
import { genSaltSync, hashSync, compareSync } from "bcrypt"
import { GeneralRole } from './entities/general_role.entity';
import { GeneralRoles } from './enums/generalRole';
import { validate as isUUID } from "uuid"
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtInterface';

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService")
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GeneralRole)
    private readonly generalRoleRepository: Repository<GeneralRole>,
    private readonly jwtService: JwtService,
  ) { }

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

      return user;

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto
    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .leftJoinAndSelect("user.role", "role")
        .where("user.email=:email", { email })
        .getOne()

      if (!user) throw new BadRequestException("email or password are incorrect")

      const checkPassword = compareSync(password, user?.password)

      if (!checkPassword) throw new BadRequestException("email or password are incorrect")

      const { password: _, ...restUserInfo } = user
      return {
        user: restUserInfo,
        token: this.generateJWT({ id: user.id })
      }

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
}
