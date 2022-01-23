import { Module } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestController } from './service-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from '../../../models/service-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRequest])],
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService],
  exports: [ServiceRequestService],
})
export class ServiceRequestModule {}
