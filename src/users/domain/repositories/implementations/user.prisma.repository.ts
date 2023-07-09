import { UsersRepository } from '../user.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { User } from '../../entities/user.entity';

export class UsersPrismaRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        role_id: 'cljvrv69k0000tyk8jqnb2lf6',
        email: user.email,
        password: user.password,
      },
    });

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}
