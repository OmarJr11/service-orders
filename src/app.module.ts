import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ServiceRequestModule } from './modules/public/service-request/service-request.module';
import { ServiceModule } from './modules/public/service/service.module';
import { TicketModule } from './modules/public/ticket/ticket.module';
import { AuthModule } from './modules/system/auth/auth.module';
import { RolesModule } from './modules/system/roles/roles.module';
import { TokensModule } from './modules/system/tokens/tokens.module';
import { UserRolesModule } from './modules/system/user-roles/user-roles.module';
import { UsersModule } from './modules/system/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DATABASE_TYPE'),
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [configService.get('TYPEORM_ENTITIES')],
          synchronize: false,
        } as TypeOrmModuleOptions;
      },
    }),
    UsersModule,
    ServiceModule,
    ServiceRequestModule,
    TicketModule,
    RolesModule,
    UserRolesModule,
    TokensModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
