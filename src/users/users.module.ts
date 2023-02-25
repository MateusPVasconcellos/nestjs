import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repository/users-repository';
import { PrismaUsersRepository } from './repository/prisma/prisma-users-repository';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaService } from 'src/database/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemovePasswordInterceptor } from 'src/shared/interceptor-password';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordInterceptor,
    },
  ],
})
export class UsersModule {}
