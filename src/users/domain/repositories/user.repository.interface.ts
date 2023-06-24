import { User } from '../entities/user.entity';

export interface UsersRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  update(user: User, id: number): Promise<User>;
  delete(id: number): Promise<void>;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
