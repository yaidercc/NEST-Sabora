import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleException } from 'src/common/handleErrors';
import { genSaltSync, hashSync } from "bcrypt"
import { GeneralRole } from './entities/general_role.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService")
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // @InjectRepository(GeneralRole)
    // private readonly 
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...restInfo } = createUserDto
    
    try {
      // const user = this.userRepository.create({
      //   ...restInfo,
      //   password: hashSync(password, genSaltSync()),
      // })

      // await this.userRepository.save(user)

      return "holi";

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

  async removeAllUsers(){
    const queryBuilder = await this.userRepository.createQueryBuilder()
    queryBuilder
    .delete()
    .where({})
    .execute()
  } 
}
