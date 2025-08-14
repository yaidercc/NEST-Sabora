import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRole } from './entities/employee_role.entity';
import { Employee } from './entities/employee.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EmployeeRole, Employee,User]),UserModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [TypeOrmModule,EmployeeService]
})
export class EmployeeModule {}
