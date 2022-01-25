import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServiceDto } from './dto/service.dto';
import { TokenHeaderInterceptor } from '../../../common/token.interceptor.ts/token.interceptor';
import { RolesEnum } from '../../../common/enum/roles.enum';
import { JwtAuthGuard } from '../../../common/guards/jwtAuth.guard';
import { IUserReq } from '../../../common/interfaces/user-req.interface';
import { UserDec } from '../../../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  @UseInterceptors(TokenHeaderInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      ...(await this.usersService.create(createUserDto)),
    };
  }

  @Post('technical')
  @UseInterceptors(TokenHeaderInterceptor)
  async createTechnical(@Body() data: CreateUserDto) {
    return {
      success: true,
      ...(await this.usersService.create(data, RolesEnum.TECHNICAL)),
    };
  }

  @Post('admin')
  @UseInterceptors(TokenHeaderInterceptor)
  async createAdmin(@Body() data: CreateUserDto) {
    return {
      success: true,
      ...(await this.usersService.create(data, RolesEnum.ADMIN)),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return {
      success: true,
      user: await this.usersService.findOne(id),
    };
  }

  @Put('')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UserDec() user: IUserReq,
  ) {
    return {
      success: true,
      user: await this.usersService.update(user.userId, updateUserDto),
    };
  }

  @Put('add-service')
  @UseGuards(JwtAuthGuard)
  async addService(@Body() serviceDto: ServiceDto, @UserDec() user: IUserReq) {
    return {
      success: true,
      user: await this.usersService.addService(user.userId, serviceDto.service),
    };
  }

  @Put('delete-service')
  @UseGuards(JwtAuthGuard)
  async deleteService(
    @Body() serviceDto: ServiceDto,
    @UserDec() user: IUserReq,
  ) {
    return {
      success: true,
      user: await this.usersService.removeService(
        user.userId,
        serviceDto.service,
      ),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return {
      success: true,
      message: await this.usersService.remove(id),
    };
  }
}
