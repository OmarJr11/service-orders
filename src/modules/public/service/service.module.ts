import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../../../models/service.entity';
import { UserRolesModule } from '../../../modules/system/user-roles/user-roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), UserRolesModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
