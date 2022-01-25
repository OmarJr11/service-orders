import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../models/user.entity';
import { ServiceModule } from '../../../modules/public/service/service.module';
import { RolesModule } from '../roles/roles.module';
import { TokensModule } from '../tokens/tokens.module';
import { UserRolesModule } from '../user-roles/user-roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => TokensModule),
    RolesModule,
    ServiceModule,
    UserRolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
