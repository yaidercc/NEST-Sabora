import { PartialType } from '@nestjs/swagger';
import { CreateMenuItemDto } from './create-menu_item.dto';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
