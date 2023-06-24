import { UsersRepository } from '../user.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { User } from '../../entities/user.entity';
import { UserRole } from 'src/shared/enums/userrole.enum';

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    await this.prisma.user.create({
      data: {
        role: UserRole.USER,
        email: user.email,
        password: user.password,
      },
    });

    return user;
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
