import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return {
      success: true,
      services: await this.serviceService.create(createServiceDto),
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
  ) {
    return {
      success: true,
      services: await this.serviceService.update(id, updateServiceDto),
    };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return {
      success: true,
      message: this.serviceService.remove(id),
    };
  }
}
