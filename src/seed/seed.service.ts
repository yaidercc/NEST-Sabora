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
import { Table } from 'src/table/entities/table.entity';
import { Schedule } from 'src/reservation/entities/schedule.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { MenuItem } from 'src/menu_item/entities/menu_item.entity';

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
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) { }

  async executeSEED() {
    await this.deleteTables()
    const roles = await this.insertGeneralRoles();
    const employeeRole = await this.insertEmployeeRoles();
    const user = await this.insertUser(roles)
    await this.insertEmployee(user!, employeeRole);
    await this.insertTables()
    await this.insertSchedules()
    await this.insertMenuItems()
    return "SEED EXECUTED"
  }

  private async deleteTables() {
    await this.reservationRepository.createQueryBuilder().delete().where({}).execute()
    await this.employeeService.removeAllEmployees()
    await this.userService.removeAllUsers()
    await this.generalRoleRepository.createQueryBuilder().delete().where({}).execute()
    await this.employeeRoleRepository.createQueryBuilder().delete().where({}).execute()
    await this.scheduleRepository.createQueryBuilder().delete().where({}).execute()
    await this.tableRepository.createQueryBuilder().delete().where({}).execute()
    await this.menuItemRepository.createQueryBuilder().delete().where({}).execute()

  }

  private async insertUser(role: GeneralRole[]) {
    const users = initialData.user.map((item, i) => {
      return this.userRepository.create({
        ...item,
        role: role[i]
      });
    })

    await this.userRepository.save(users)
    return users.pop()
  }
  private async insertEmployee(user: User, employeeRole: EmployeeRole) {
    const employee = this.employeeRepository.create({
      ...initialData.employee,
      user,
      employee_role: employeeRole
    });
    await this.employeeRepository.save(employee)
    return employee
  }


  private async insertGeneralRoles() {
    const generalRoles = initialData.generalRoles.map((item) => this.generalRoleRepository.create(item))
    await this.generalRoleRepository.save(generalRoles)
    return generalRoles
  }

  private async insertEmployeeRoles() {
    const employeeRoles = initialData.employeeRoles.map((item) => this.employeeRoleRepository.create(item))
    await this.employeeRoleRepository.save(employeeRoles)
    return employeeRoles[0]
  }

  private async insertTables() {
    const tables = initialData.tables.map((item) => this.tableRepository.create(item))
    await this.tableRepository.save(tables)
    return tables
  }

  private async insertSchedules() {
    const schedule = initialData.schedule.map((item) => this.scheduleRepository.create(item))
    await this.scheduleRepository.save(schedule)
    return schedule
  }

  private async insertMenuItems() {
    const menuItem = initialData.menuItem.map((item) => this.menuItemRepository.create(item))
    await this.menuItemRepository.save(menuItem)
    return menuItem
  }
}


