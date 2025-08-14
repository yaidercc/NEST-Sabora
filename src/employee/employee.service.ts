import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { EmployeeRole } from './entities/employee_role.entity';
import { handleException } from 'src/common/handleErrors';
import { User } from 'src/user/entities/user.entity';
import { validate as isUUID } from "uuid"
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isActive } from 'src/common/isActive';

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

      const existsEmployee = await queryRunner.manager.findOneBy(Employee, { user: user })
      if (existsEmployee) throw new ConflictException('User already exits as an employee')

      const employee_role = await queryRunner.manager.findOneBy(EmployeeRole, { id: createEmployeeDto.employee_role_id })
      if (!employee_role) throw new NotFoundException(`Employee role not found`)


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

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination

    return await this.employeeRepository.find({
      take: limit,
      skip: offset,
      relations: {
        user: true,
        employee_role: true
      },
      where: { is_active: true }
    })
  }

  async findOne(term: string) {
    let employee: Employee | null = null;
    if (isUUID(term)) {
      const queryBuilder = await this.employeeRepository.createQueryBuilder("employee")
      employee = await queryBuilder
        .leftJoinAndSelect("employee.employee_role", "employee_role")
        .leftJoinAndSelect("employee.user", "user")
        .where("employee.id=:term or employee.user=:term", {
          term,
        })
        .andWhere("employee.is_active=:is_active", { is_active: true })
        .getOne()
    }

    if (!employee) throw new NotFoundException("Employee not found")
    return employee
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {

    try {
      if (!updateEmployeeDto || typeof updateEmployeeDto !== 'object') {
        throw new BadRequestException("No data provided to update");
      }

      const { employee_role_id = "", ...toUpdate } = updateEmployeeDto
      const employee = await this.employeeRepository.preload({
        id,
        ...updateEmployeeDto
      })

      if (!employee) throw new NotFoundException("Employee not found")

      const is_active = await isActive(id, this.employeeRepository);
      if (!is_active) {
        throw new BadRequestException("Employee is inactive")
      }

      if (toUpdate.user_id) {
        const findRepeatEmployee = await this.employeeRepository.findOne({
          where: {
            user: {
              id: toUpdate.user_id
            },
            id: Not(id)
          }
        })
        if (findRepeatEmployee) {
          throw new ConflictException('User already exits as an employee')
        }
      }

      if (employee_role_id.trim()) {
        const employee_role = await this.employeeRoleRepository.findOneBy({ id: employee_role_id })
        if (!employee_role) throw new NotFoundException("The specified employee role does not exists")
        employee.employee_role = employee_role
      }

      await this.employeeRepository.save(employee)

      return await this.findOne(id)
    } catch (error) {
      handleException(error, this.logger)
    }
  }


  async remove(id: string) {
    try {
      const employee = await this.employeeRepository.findOneBy({ id });

      if (!employee) throw new NotFoundException("Employee not found")
      const is_active = await isActive(id, this.employeeRepository);
      if (!is_active) {
        throw new BadRequestException("Employee is inactive")
      }

      return await this.employeeRepository.update(id, { is_active: false })

    } catch (error) {
      handleException(error, this.logger)
    }
  }

  async removeAllEmployees() {
    const queryBuilder = this.employeeRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }
}
