import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
class UsersSendMailProducerService {
  constructor(@InjectQueue('usersQueue') private queue: Queue) {}

  async create(createUserDto: CreateUserDto) {
    this.queue.add('usersQueue.create', createUserDto);
  }
}

export { UsersSendMailProducerService };
