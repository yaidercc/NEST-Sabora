import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleException } from 'src/common/handleErrors';
import { genSaltSync, hashSync } from "bcrypt"

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService")
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...restInfo } = createUserDto
    try {
      const user = this.userRepository.create({
        ...restInfo,
        password: hashSync(password, genSaltSync())
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
}
