import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Processor('usersQueue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('usersQueue.create')
  async sendMailJob(job: Job<CreateUserDto>) {
    const { data } = job;
    await this.mailService.sendMail({
      to: data.email,
      from: 'Team G',
      subject: 'Welcome!',
      text: 'Your registration was successful',
    });
  }
}

export { SendMailConsumer };
