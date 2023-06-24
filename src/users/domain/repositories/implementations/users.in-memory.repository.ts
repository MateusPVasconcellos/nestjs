/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '../../entities/user.entity';
import { UsersRepository } from '../user.repository.interface';

export class UsersInMemoryRepository implements UsersRepository {
  private users: User[] = [];

  findById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  update(user: User, id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(user: User) {
    this.users.push(user);
    return user;
  }

  async findAll() {
    return this.users;
  }
}
