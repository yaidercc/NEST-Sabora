import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from 'src/user/user.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { TableModule } from 'src/table/table.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [UserModule, EmployeeModule, TableModule],
  exports: [SeedService]
})
export class SeedModule { }
