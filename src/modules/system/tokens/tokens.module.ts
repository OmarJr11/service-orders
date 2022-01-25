import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '../../../models/refreshToken.entity';
import { UsersModule } from '../users/users.module';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
