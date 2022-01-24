import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Status } from '../../../common/enum/status.enum';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return {
      success: true,
      ticket: await this.ticketService.create(createTicketDto),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      ticket: await this.ticketService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return {
      success: true,
      ticket: await this.ticketService.findOne(id),
    };
  }

  @Put(':id/managed')
  async managed(@Param('id') id: number) {
    return {
      success: true,
      ticket: await this.ticketService.changeStatus(id, Status.MANAGED),
    };
  }

  @Put(':id/cancelled')
  async cancelled(@Param('id') id: number) {
    return {
      success: true,
      ticket: await this.ticketService.changeStatus(id, Status.CANCELLED),
    };
  }
}
