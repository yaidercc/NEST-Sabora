import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneralRole } from 'src/user/entities/general_role.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(GeneralRole)
    private readonly generalRoleRepository: Repository<GeneralRole>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) { }

  async executeSEED() {
    await this.deleteTables()
    const adminRole = await this.inserGeneralRoles();
    await this.insertUsert(adminRole)
    return "SEED EXECUTED"
  }

  private async deleteTables() {
    await this.userService.removeAllUsers()
    const queryBuilder = this.generalRoleRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async insertUsert(adminRole: GeneralRole) {
    console.log(adminRole)
    const user = this.userRepository.create({
      ...initialData.user,
      role: adminRole
    });
    await this.userRepository.save(user)
    
  }

  private async inserGeneralRoles() {
    const generalRoles = initialData.generalRoles.map((item) => this.generalRoleRepository.create(item))
    await this.generalRoleRepository.save(generalRoles)
    return generalRoles[0]
  }
}


