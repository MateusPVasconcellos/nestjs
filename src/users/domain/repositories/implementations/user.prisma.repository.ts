import { UsersRepository } from '../user.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { User } from '../../entities/user.entity';

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}
  create(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  update(user: User, id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
