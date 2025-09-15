import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from 'src/user/user.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { TableModule } from 'src/table/table.module';
import { ReservationModule } from 'src/reservation/reservation.module';
import { MenuItemModule } from 'src/menu_item/menu_item.module';
import { OrderModule } from 'src/order/order.module';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [UserModule, EmployeeModule, TableModule,ReservationModule, MenuItemModule, OrderModule, InvoiceModule],
  exports: [SeedService]
})
export class SeedModule { }
