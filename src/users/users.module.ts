import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaService } from 'src/database/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemovePasswordInterceptor } from 'src/shared/interceptor-password';
import { CryptModule } from 'src/shared/crypt/crypt.module';
import { BullModule } from '@nestjs/bull';
import { UsersSendMailProducerService } from 'src/jobs/usersMail-producer.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    UsersSendMailProducerService,
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
})
export class UsersModule {}
