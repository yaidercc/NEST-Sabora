import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneralRole } from 'src/user/entities/general_role.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import { User } from 'src/user/entities/user.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { EmployeeRole } from 'src/employee/entities/employee_role.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(GeneralRole)
    private readonly generalRoleRepository: Repository<GeneralRole>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly employeeService: EmployeeService,
    @InjectRepository(EmployeeRole)
    private readonly employeeRoleRepository: Repository<EmployeeRole>,
  ) { }

  async executeSEED() {
    await this.deleteTables()
    const adminRole = await this.insertGeneralRoles();
    await this.insertEmployeeRoles();
    await this.insertUser(adminRole)
    return "SEED EXECUTED"
  }

  private async deleteTables() {
    await this.employeeService.removeAllEmployees()
    await this.userService.removeAllUsers()
    await Promise.all([
      this.generalRoleRepository.createQueryBuilder().delete().where({}).execute(),
      this.employeeRoleRepository.createQueryBuilder().delete().where({}).execute()
    ])
  }

  private async insertUser(adminRole: GeneralRole) {
    const user = this.userRepository.create({
      ...initialData.user,
      role: adminRole
    });
    await this.userRepository.save(user)
    return user
  }


  private async insertGeneralRoles() {
    const generalRoles = initialData.generalRoles.map((item) => this.generalRoleRepository.create(item))
    await this.generalRoleRepository.save(generalRoles)
    return generalRoles[0]
  }

  private async insertEmployeeRoles() {
    const employeeRoles = initialData.employeeRoles.map((item) => this.employeeRoleRepository.create(item))
    await this.employeeRoleRepository.save(employeeRoles)
    return employeeRoles[0]
  }
}


