import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile } from '@nestjs/common';
import { MenuItemService } from './menu_item.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FileUploader } from 'src/common/decorators/fileUpload.decorator';
import { Auth } from 'src/user/decorators/auth.decorator';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';

@Controller('menu-item')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) { }

  @Post()
  @FileUploader()
  @Auth([GeneralRoles.ADMIN],{},[EmployeeRoles.MANAGER])
  create(@Body() createMenuItemDto: CreateMenuItemDto, @UploadedFile() file: Express.Multer.File) {
    return this.menuItemService.create(createMenuItemDto, file);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.menuItemService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.menuItemService.findOne(term);
  }

  @Patch(':id')
  @FileUploader()
  @Auth([GeneralRoles.ADMIN],{},[EmployeeRoles.MANAGER])
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto?: UpdateMenuItemDto,
    @UploadedFile() file?: Express.Multer.File) {
    return this.menuItemService.update(id, updateMenuItemDto, file);
  }

  @Delete(':id')
  @Auth([GeneralRoles.ADMIN],{},[EmployeeRoles.MANAGER])
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(id);
  }
}
