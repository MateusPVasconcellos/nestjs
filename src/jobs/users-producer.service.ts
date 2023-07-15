import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
class UsersProducerService {
  constructor(@InjectQueue('usersQueue') private queue: Queue) {}

  async sendMail(createUserDto: CreateUserDto) {
    await this.queue.add('usersQueue.sendWelcomeEmail', createUserDto);
  }

  async created(createUserDto: CreateUserDto) {
    await this.queue.add('usersQueue.created', createUserDto);
  }

  async signup(createUserDto: CreateUserDto) {
    await this.queue.add('usersQueue.signup', createUserDto);
  }
}

export { UsersProducerService };
