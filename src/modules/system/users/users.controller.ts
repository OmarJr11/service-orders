import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServiceDto } from './dto/service.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      user: await this.usersService.create(createUserDto),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      users: await this.usersService.findAll(),
    };
  }

  @Get('technical')
  async findAllTechnical() {
    return {
      success: true,
      users: await this.usersService.findAll('Technical'),
    };
  }

  @Get('clients')
  async findAllUser() {
    return {
      success: true,
      users: await this.usersService.findAll('User'),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return {
      success: true,
      user: await this.usersService.findOne(id),
    };
  }

  @Put(':id')
  async addService(@Param('id') id: number, @Body() serviceDto: ServiceDto) {
    return {
      success: true,
      user: await this.usersService.addService(id, serviceDto.service),
    };
  }

  @Put(':id/delete')
  async deleteService(@Param('id') id: number, @Body() serviceDto: ServiceDto) {
    return {
      success: true,
      user: await this.usersService.removeService(id, serviceDto.service),
    };
  }

  @Put(':id/:type')
  async update(
    @Param('id') id: number,
    @Param('type') type: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      success: true,
      user: await this.usersService.update(id, type, updateUserDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return {
      success: true,
      message: await this.usersService.remove(id),
    };
  }
}
