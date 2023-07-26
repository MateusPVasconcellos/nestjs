import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemovePasswordInterceptor } from 'src/shared/interceptors/interceptor-password';
import { CryptModule } from 'src/shared/crypt/crypt.module';
import { BullModule } from '@nestjs/bull';
import { UsersProducerService } from 'src/users/jobs/users-producer.service';
import { UserConsumer } from 'src/users/queues/users-consumer';
import { provideUsersRepository } from './domain/repositories/user.repository.provider';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersProducerService,
    UserConsumer,
    PrismaService,
    ...provideUsersRepository(),
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordInterceptor,
    },
  ],
  imports: [
    CryptModule,
    BullModule.registerQueue({
      name: 'usersQueue',
    }),
  ],
  exports: [UsersService, UsersProducerService, ...provideUsersRepository()],
})
export class UsersModule {}
