import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { CryptModule } from 'src/shared/crypt/crypt.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SigninValidationMiddleware } from './middlewares/signin-validation.middleware';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PrismaService } from 'src/database/prisma.service';
import { provideAuthRepository } from './domain/repositories/auth.repository.provider';
import { JwtService } from './services/jwt.service';
import { SignupValidationMiddleware } from './middlewares/signup-validation.middleware';

@Module({
  imports: [UsersModule, CryptModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    PrismaService,
    ...provideAuthRepository(),
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SigninValidationMiddleware).forRoutes('signin');
    consumer.apply(SignupValidationMiddleware).forRoutes('signup');
  }
}
