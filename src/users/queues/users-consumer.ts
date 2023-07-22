import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException } from '@nestjs/common';
import { Job } from 'bull';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Processor('usersQueue')
class UserConsumer {
  constructor(private readonly mailService: MailerService) {}

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log(`Fired Excption from ${job.name}:`, error);
    throw new HttpException(error.message, 401);
  }

  @Process('usersQueue.created')
  async verify(job: Job<CreateUserDto>) {
    //im-
  }
}

export { UserConsumer };
