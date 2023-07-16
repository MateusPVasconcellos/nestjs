import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException } from '@nestjs/common';
import { Job } from 'bull';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Processor('usersQueue')
class UserConsumer {
  constructor(
    private readonly mailService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log(`Fired Excption from ${job.name}:`, error);
    throw new HttpException(error.message, 401);
  }

  @Process('usersQueue.sendWelcomeEmail')
  async sendMailJob(job: Job<CreateUserDto>) {
    const { data } = job;
    await this.mailService.sendMail({
      to: data.email,
      from: 'Team G',
      subject: 'Welcome!',
      text: 'Your registration was successful',
    });
  }

  @Process('usersQueue.created')
  async verify(job: Job<CreateUserDto>) {
    //im-
  }

  @Process('usersQueue.signup')
  async signupJob(job: Job<CreateUserDto>) {
    const { data } = job;
    return await this.usersService.create(data);
  }
}

export { UserConsumer };
