import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../../../models/ticket.entity';
import { ServiceModule } from '../service/service.module';
import { UsersModule } from '../../../modules/system/users/users.module';
import { ServiceRequestModule } from '../service-request/service-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    ServiceModule,
    UsersModule,
    ServiceRequestModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
