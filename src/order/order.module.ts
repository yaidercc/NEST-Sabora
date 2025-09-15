import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { UserModule } from 'src/user/user.module';
import { TableModule } from 'src/table/table.module';
import { MenuItemModule } from 'src/menu_item/menu_item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail]), UserModule,TableModule,MenuItemModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [TypeOrmModule, OrderService]
})
export class OrderModule { }
