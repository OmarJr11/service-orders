import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../../../models/user-role.entity';
import { UserRolesService } from './user-roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
