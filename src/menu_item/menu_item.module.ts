import { Module } from '@nestjs/common';
import { MenuItemService } from './menu_item.service';
import { MenuItemController } from './menu_item.controller';

@Module({
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuItemModule {}
