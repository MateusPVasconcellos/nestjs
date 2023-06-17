import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Processor('usersQueue')
class UserConsumer {
  constructor(private mailService: MailerService) {}

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
}

export { UserConsumer };
