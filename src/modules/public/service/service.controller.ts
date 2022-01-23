import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';

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
  findOne(@Param('id') id: number) {
    return this.serviceService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return {
      success: true,
      message: this.serviceService.remove(id),
    };
  }
}
