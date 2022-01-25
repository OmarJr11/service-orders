import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Status } from '../../../common/enum/status.enum';
import { JwtAuthGuard } from '../../../common/guards/jwtAuth.guard';
import { UserDec } from '../../../common/decorators/user.decorator';
import { IUserReq } from '../../../common/interfaces/user-req.interface';

@UseGuards(JwtAuthGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @UserDec() user: IUserReq,
  ) {
    return {
      success: true,
      ticket: await this.ticketService.create(createTicketDto, user),
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
  async managed(@Param('id') id: number, @UserDec() user: IUserReq) {
    return {
      success: true,
      ticket: await this.ticketService.changeStatus(id, Status.MANAGED, user),
    };
  }

  @Put(':id/cancelled')
  async cancelled(@Param('id') id: number, @UserDec() user: IUserReq) {
    return {
      success: true,
      ticket: await this.ticketService.changeStatus(id, Status.CANCELLED, user),
    };
  }
}
