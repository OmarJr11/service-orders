import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../models/user.entity';
import { ServiceModule } from '../../../modules/public/service/service.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ServiceModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
