import { Module } from '@nestjs/common';
import { MenuItemService } from './menu_item.service';
import { MenuItemController } from './menu_item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu_item.entity';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem]), CommonModule,UserModule],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports: [TypeOrmModule, MenuItemService]
})
export class MenuItemModule {}
