import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException } from '@nestjs/common';
import { Job } from 'bull';
import { UserCreatedEvent } from '../events/user-created.event';

@Processor('authQueue')
class AuthConsumer {
  constructor(private readonly mailService: MailerService) {}

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log(`Fired Excption from ${job.name}:`, error);
    throw new HttpException(error.message, 401);
  }

  @Process('authQueue.sendActivateEmail')
  async sendMailJob(job: Job<UserCreatedEvent>) {
    const { data } = job;
    await this.mailService.sendMail({
      to: data.email,
      from: 'Team G',
      subject: 'Welcome!',
      text:
        'Your registration was successful, click in the link to activate your account.' +
        data.activateToken,
    });
  }
}

export { AuthConsumer };
