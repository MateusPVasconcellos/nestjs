import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaService } from 'src/database/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemovePasswordInterceptor } from 'src/shared/interceptor-password';
import { CryptModule } from 'src/shared/crypt/crypt.module';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordInterceptor,
    },
  ],
  imports: [CryptModule],
})
export class UsersModule {}
