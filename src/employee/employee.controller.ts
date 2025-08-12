import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { GeneralRoles } from 'src/common/enums/roles';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('employee')
@Auth([GeneralRoles.admin])
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto
  ) {
    return this.employeeService.findAll(pagination);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.employeeService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
