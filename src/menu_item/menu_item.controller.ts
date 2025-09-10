import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile } from '@nestjs/common';
import { MenuItemService } from './menu_item.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FileUploader } from 'src/common/decorators/fileUpload.decorator';
import { Auth } from 'src/user/decorators/auth.decorator';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { MenuItem } from './entities/menu_item.entity';


@Controller('menu-item')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) { }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Create a menu item" })
  @ApiResponse({ status: 201, description: "menu item created", type: MenuItem })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 409, description: "Menu item already exists" })
  @ApiExtraModels(CreateMenuItemDto) // Create an schema with the Dto 
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateMenuItemDto) }, // Get the Dto created before
        {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
              description: 'Image file - Max 5MB',
            },
          },
        },
      ],
    },
  })
  @Post()
  @FileUploader()
  @Auth([GeneralRoles.ADMIN], {}, [EmployeeRoles.MANAGER])
  create(@Body() createMenuItemDto: CreateMenuItemDto, @UploadedFile() file: Express.Multer.File) {
    return this.menuItemService.create(createMenuItemDto, file);
  }

  @ApiOperation({ summary: "Get all menu items" })
  @ApiResponse({ status: 200, description: "Menu items", type: [MenuItem] })
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.menuItemService.findAll(paginationDto);
  }

  @ApiOperation({ summary: "Find one menu item by a term of search" })
  @ApiResponse({ status: 200, description: "Menu item", type: MenuItem })
  @ApiResponse({ status: 400, description: "Menu item is not available" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.menuItemService.findOne(term);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Update a menu item" })
  @ApiResponse({ status: 200, description: "Menu item updated successfully", type: MenuItem })
  @ApiResponse({ status: 400, description: "Menu item is not available" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  @ApiExtraModels(UpdateMenuItemDto)
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(UpdateMenuItemDto) },
        {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
              description: 'Image file (optional) - Max 5MB',
            },
          },
          required: [],
        },
      ],
      required: [],
    },
  })
  @Patch(':id')
  @FileUploader()
  @Auth([GeneralRoles.ADMIN], {}, [EmployeeRoles.MANAGER])
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto?: UpdateMenuItemDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.menuItemService.update(id, updateMenuItemDto, file);
  }


  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Delete a menu item" })
  @ApiResponse({ status: 200, description: "Menu item deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  @Delete(':id')
  @Auth([GeneralRoles.ADMIN], {}, [EmployeeRoles.MANAGER])
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(id);
  }
}
