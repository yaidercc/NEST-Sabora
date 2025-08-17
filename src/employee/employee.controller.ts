import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/user/decorators/auth.decorator';
import { GeneralRoles } from 'src/common/enums/roles';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';

@ApiBearerAuth('access-token')
@Controller('employee')
@Auth([GeneralRoles.ADMIN])
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @ApiOperation({ summary: "Create an employee" })
  @ApiResponse({ status: 201, description: "employee was created", type: Employee })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "User not found/Unauthorized" })
  @ApiResponse({ status: 404, description: "Employee role not found" })
  @ApiResponse({ status: 409, description: "User already exits as an employee" })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @ApiOperation({ summary: "Get all employees" })
  @ApiResponse({ status: 200, description: "Employees", type: [Employee] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.employeeService.findAll(pagination);
  }

  @ApiOperation({ summary: "Find one employee by a term of search" })
  @ApiResponse({ status: 200, description: "Employee", type: Employee })
  @ApiResponse({ status: 400, description: "Employee is inactive" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Employee not found" })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.employeeService.findOne(term);
  }

  @ApiOperation({ summary: "Update an employee" })
  @ApiResponse({ status: 200, description: "Employee updated successfully", type: Employee })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Employee not found/The specified employee role does not exists" })
  @ApiResponse({ status: 409, description: "User already exits as an employee" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @ApiOperation({ summary: "Delete an employee" })
  @ApiResponse({ status: 200, description: "Employee deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Employee not found" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
