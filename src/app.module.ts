import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './common/configs/config';
import { ConfigifyModule } from '@itgorillaz/configify';
import { AppConfig } from './common/configs/app.config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { JwtAuthGuard } from './common/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      imports: [ConfigifyModule],
      extraProviders: [],
      useFactory: (appConfig: AppConfig) => ({
        type: 'postgres',
        url: appConfig.dbUrl,
        logging: true,
        entities: [ User,],
        synchronize: true,
      }),
    }),
    JwtModule.register({
      global: true,
    }),
    
    UserModule,
   
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
