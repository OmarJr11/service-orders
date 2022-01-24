import { Module } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestController } from './service-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from '../../../models/service-request.entity';
import { ServiceModule } from '../service/service.module';
import { UsersModule } from '../../../modules/system/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest]),
    ServiceModule,
    UsersModule,
  ],
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService],
  exports: [ServiceRequestService],
})
export class ServiceRequestModule {}
