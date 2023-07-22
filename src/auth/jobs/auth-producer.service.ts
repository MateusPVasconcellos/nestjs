import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
class AuthProducerService {
  constructor(@InjectQueue('authQueue') private queue: Queue) {}

  async sendActivateEmail(createUserDto: CreateUserDto) {
    await this.queue.add('authQueue.sendActivateEmail', createUserDto);
  }
}

export { AuthProducerService };
