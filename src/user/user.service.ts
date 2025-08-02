import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleException } from 'src/common/handleErrors';
import { genSaltSync, hashSync } from "bcrypt"
import { GeneralRole } from './entities/general_role.entity';
import { GeneralRoles } from './enums/generalRole';
import {  validate as isUUID} from "uuid"

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService")
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GeneralRole)
    private readonly generalRoleRepository: Repository<GeneralRole>
  ) { }

  async create(createUserDto: CreateUserDto) {
    // TODO: Validate if an user is created by an admin
    const { password, role, ...restInfo } = createUserDto
    const generalRole = await this.findGeneralRole(role || GeneralRoles.client)
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

  async removeAllUsers() {
    const queryBuilder = await this.userRepository.createQueryBuilder()
    queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async findGeneralRole(term: string) {
    let role: GeneralRole | null = null;
    if(isUUID(term)) role = await this.generalRoleRepository.findOneBy({id: term})
    else role = await this.generalRoleRepository.findOneBy({name: term})
    
    if(!role){
      throw new BadRequestException("general role not found")
    }

    return role
  }
}
