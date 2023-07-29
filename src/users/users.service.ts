import {
  USERS_REPOSITORY_TOKEN,
  UsersRepository,
} from './domain/repositories/user.repository.interface';
import { User } from './domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly userRepository: UsersRepository,
  ) {}

  async findMany(): Promise<User[]> {
    return await this.userRepository.findMany({});
  }
}
