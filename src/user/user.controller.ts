import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { UserLogin } from './interfaces/userResponses';
import { GeneralRole } from './entities/general_role.entity';

import { NewPassword, RequestTempPasswordDto } from './dto/reset.password.dto';
import { GeneralRoles } from 'src/common/enums/roles';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Create an user" })
  @ApiResponse({ status: 201, description: "User was created", type: User })
  @ApiResponse({ status: 400, description: "Bad request" })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "User logged", type: UserLogin })
  @ApiResponse({ status: 400, description: "email or password are incorrect" })
  @HttpCode(200)
  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "Users", type: [User] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth('access-token')
  @Auth([GeneralRoles.ADMIN], { allowAdmin: true })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: "Set and request temporal password" })
  @ApiResponse({ status: 200, description: "If the user exists, a temporary password has been sent to your email.", })
  @ApiResponse({ status: 404, description: "User not found" })
  @HttpCode(200)
  @Post("request-temp-password")
  sendEmailToResetPassword(@Body() requestTempPasswordDto: RequestTempPasswordDto) {
    return this.userService.requestTempPassword(requestTempPasswordDto)
  }

  @ApiOperation({ summary: "Change user password" })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 400, description: "Passwords do not match" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Auth()
  @HttpCode(200)
  @Post("change-password")
  changePassword(@Body() newPassword: NewPassword, @GetUser() user: User) {
    return this.userService.changePassword(newPassword, user)
  }

  @ApiOperation({ summary: "Set and request temporal password" })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: "User", type: User })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Auth()
  @Get("profile")
  profile(@GetUser() user) {
    return user
  }

  @ApiOperation({ summary: "Find one user by a search term" })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: "User", type: User })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Auth([GeneralRoles.ADMIN], { allowAdmin: true })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.userService.findOne(term);
  }

  @ApiOperation({ summary: "Update an user" })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: "User updated successfully", type: User })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found/The specified role does not exists" })
  @Patch(':id')
  @Auth([], { allowAdmin: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  @ApiOperation({ summary: "Delete an user" })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @Auth([GeneralRoles.ADMIN])
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}