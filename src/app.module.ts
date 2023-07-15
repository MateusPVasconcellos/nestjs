import { Global, Module } from '@nestjs/common/decorators/modules';
import { UsersModule } from './users/users.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import redisConfig from './config/redis.config';
import mailConfig from './config/mail.config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import jwtConfig from './config/jwt.config';

@Global()
@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ load: [jwtConfig], isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [redisConfig] })],
      useFactory: (configRedis: ConfigType<typeof redisConfig>) => ({
        redis: {
          port: configRedis.port,
          host: configRedis.host,
        },
      }),
      inject: [redisConfig.KEY],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [mailConfig] })],
      useFactory: (
        configMail: ConfigType<typeof mailConfig>,
      ): MailerOptions => ({
        transport: {
          host: configMail.host,
          port: configMail.port,
          auth: {
            user: configMail.auth.user,
            pass: configMail.auth.password,
          },
        },
      }),
      inject: [mailConfig.KEY],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
