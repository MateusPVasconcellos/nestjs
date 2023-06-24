/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '../../entities/user.entity';
import { UsersRepository } from '../user.repository.interface';

export class UsersInMemoryRepository implements UsersRepository {
  create(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
