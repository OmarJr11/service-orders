import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../../models/role.entity';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UserRolesModule],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
