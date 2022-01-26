import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../../../common/guards/jwtAuth.guard';
import { UserDec } from '../../../common/decorators/user.decorator';
import { IUserReq } from '../../../common/interfaces/user-req.interface';
import { Status } from '../../../common/enum/status.enum';

@UseGuards(JwtAuthGuard)
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @UserDec() user: IUserReq,
  ) {
    return {
      success: true,
      services: await this.serviceService.create(createServiceDto, user),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      services: await this.serviceService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return {
      success: true,
      services: await this.serviceService.findOne(id),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @UserDec() user: IUserReq,
  ) {
    return {
      success: true,
      services: await this.serviceService.update(id, updateServiceDto, user),
    };
  }

  @Put(':id/activate')
  async activate(@Param('id') id: number, @UserDec() user: IUserReq) {
    return {
      success: true,
      services: await this.serviceService.changeStatus(id, Status.ACTIVE, user),
    };
  }

  @Put(':id/disable')
  async disable(@Param('id') id: number, @UserDec() user: IUserReq) {
    return {
      success: true,
      services: await this.serviceService.changeStatus(
        id,
        Status.INACTIVE,
        user,
      ),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @UserDec() user: IUserReq) {
    return {
      success: true,
      message: await this.serviceService.remove(id, user),
    };
  }
}
