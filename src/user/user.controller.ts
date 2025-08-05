import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { UserLogin } from './interfaces/userResponses';
import { GeneralRole } from './entities/general_role.entity';
import { GeneralRoles } from './enums/roles';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: "User was created",
    type: User
  })
  @ApiResponse({
    status: 400,
    description: "Bad request"
  })
  create(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto);
  }

  @Post("login")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "User logged",
    type: UserLogin
  })
  @ApiResponse({
    status: 400,
    description: "email or password are incorrect"
  })
  login(
    @Body() loginUserDto: LoginUserDto
  ) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: "Users",
    type: [User]
  })
  @Auth([GeneralRoles.admin], { allowAdmin: true })
  findAll() {
    return this.userService.findAll();
  }

  @Get("profile")
  @ApiResponse({
    status: 200,
    description: "User",
    type: User
  })
  @Auth()
  profile(@GetUser() user) {
    return user
  }

  @Get(':term')
  @Auth([GeneralRoles.admin], { allowAdmin: true })
  findOne(@Param('term') term: string) {
    return this.userService.findOne(term);
  }

  @Patch(':id')
  @Auth([], { allowAdmin: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}