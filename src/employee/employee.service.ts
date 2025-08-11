import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { DataSource, Repository } from 'typeorm';
import { EmployeeRole } from './entities/employee_role.entity';
import { handleException } from 'src/common/handleErrors';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger("EmployeeService")
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeRole)
    private readonly employeeRoleRepository: Repository<EmployeeRole>,
    private readonly dataSource: DataSource
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect();
      queryRunner.startTransaction()

      const user = await queryRunner.manager.findOneBy(User, { id: createEmployeeDto.user_id })
      if (!user) throw new NotFoundException(`User not found`)

      const employee_role = await queryRunner.manager.findOneBy(EmployeeRole, { id: createEmployeeDto.employee_role_id })
      if (!employee_role) throw new NotFoundException(`employee role not found`)

      const employee = queryRunner.manager.create(Employee, {
        ...createEmployeeDto,
        user,
        employee_role,
      })

      await queryRunner.manager.save(Employee, employee);

      await queryRunner.commitTransaction()

      return employee

    } catch (error) {
      await queryRunner.rollbackTransaction()
      handleException(error, this.logger)
    } finally {
      await queryRunner.release()
    }
  }

  findAll() {
    return `This action returns all employee`;
  }

  async findOne(id: string) {
    return await this.employeeRepository.findOneBy({ id });
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async removeAllEmployees() {
    const queryBuilder = await this.employeeRepository.createQueryBuilder()
    queryBuilder
      .delete()
      .where({})
      .execute()
  }
}
