import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { GeneralRoles } from 'src/common/enums/roles';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Table } from './entities/table.entity';
import { SearchTableDto } from './dto/search-table.dto';

@ApiBearerAuth('access-token')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @ApiOperation({ summary: "Create a table" })
  @ApiResponse({ status: 201, description: "table was created", type: Table })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "User not found/Unauthorized" })
  @Auth([GeneralRoles.ADMIN])
  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @ApiOperation({ summary: "Find tables by capacity" })
  @ApiResponse({ status: 200, description: "Tables", type: [Table] })
  @Auth([GeneralRoles.ADMIN])
  @Post("find-by-capacity")
  @HttpCode(200)
  findByCapacity(@Query() paginationDTO: PaginationDto, @Body() searchTableDto: SearchTableDto) {
    return this.tableService.findTablesByCapacity(paginationDTO, searchTableDto);
  }

  @ApiOperation({ summary: "Get all tables" })
  @ApiResponse({ status: 200, description: "Tables", type: [Table] })
  @Auth()
  @Get()
  findAll(@Query() paginationDTO: PaginationDto) {
    return this.tableService.findAll(paginationDTO);
  }


  @ApiOperation({ summary: "Find one table by a search term" })
  @ApiResponse({ status: 200, description: "Table", type: Table })
  @ApiResponse({ status: 400, description: "Table is not available" })
  @ApiResponse({ status: 404, description: "Table not found" })
  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }


  @ApiOperation({ summary: "Update a table" })
  @ApiResponse({ status: 200, description: "Table updated successfully", type: Table })
  @ApiResponse({ status: 400, description: "Table is not available" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Table not found" })
  @Auth([GeneralRoles.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.update(id, updateTableDto);
  }


  @ApiOperation({ summary: "Delete a table" })
  @ApiResponse({ status: 200, description: "Table deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Table not found" })
  @Auth([GeneralRoles.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}
