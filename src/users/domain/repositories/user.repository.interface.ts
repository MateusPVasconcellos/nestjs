import { User } from '../entities/user.entity';

export interface UsersRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
