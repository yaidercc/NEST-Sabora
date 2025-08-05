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

  async findAll() {
    const user = await this.userRepository.find()
    return user
  }

  async findOne(term: string) {
    let user: User | null = null;

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

    try {
      await this.userRepository.save(user)
      return await this.findOne(id)
    } catch (error) {
      handleException(error, this.logger)
    }
    return `This action updates a #${id} user`;
  }

  private isEmpty(){

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
