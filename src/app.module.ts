import { Global, Module } from '@nestjs/common/decorators/modules';
import { UsersModule } from './users/users.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigType } from '@nestjs/config';
import redisConfig from './config/redis.config';
import mailConfig from './config/mail.config';

@Global()
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
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
})
export class AppModule {}
