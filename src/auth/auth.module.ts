import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { CryptModule } from 'src/shared/crypt/crypt.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PrismaService } from 'src/database/prisma.service';
import { provideAuthRepository } from './domain/repositories/auth.repository.provider';
import { JwtService } from './services/jwt.service';
import { SignupValidationMiddleware } from './middlewares/signup-validation.middleware';
import { AuthProducerService } from './jobs/auth-producer.service';
import { BullModule } from '@nestjs/bull';
import { AuthConsumer } from './queues/auth-consumer';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { RemovePasswordInterceptor } from 'src/shared/interceptor-password';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';

@Module({
  imports: [
    UsersModule,
    CryptModule,
    LoggerModule,
    JwtModule.register({}),
    BullModule.registerQueue({
      name: 'authQueue',
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthProducerService,
    PrismaService,
    AuthConsumer,
    ...provideAuthRepository(),
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordInterceptor,
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(SignupValidationMiddleware).forRoutes('signup');
  }
}
