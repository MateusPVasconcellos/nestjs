import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
class AuthProducerService {
  constructor(@InjectQueue('authQueue') private queue: Queue) {}

  async sendActivateEmail(userCreatedEvent: UserCreatedEvent) {
    await this.queue.add('authQueue.sendActivateEmail', userCreatedEvent);
  }
}

export { AuthProducerService };
