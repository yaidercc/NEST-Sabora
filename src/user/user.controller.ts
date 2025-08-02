import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from "@nestjs/passport"
import { Auth } from './decorators/auth.decorator';
import { getUser } from './decorators/get-user.decorator';

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
  @Auth()
  create(
    @Body() createUserDto: CreateUserDto,
    @getUser() user
  ) {
    return this.userService.create(createUserDto, user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
