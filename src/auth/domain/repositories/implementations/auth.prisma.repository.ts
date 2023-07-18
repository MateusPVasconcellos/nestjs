import { User } from 'src/users/domain/entities/user.entity';
import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { PrismaService } from 'src/database/prisma.service';
import { AuthRepository } from '../auth.repository.interface';

export class AuthPrismaRepository implements AuthRepository {
  constructor(private prisma: PrismaService) {}
  async updateRefreshToken(
    hashedRefreshToken: string,
    user_id: string,
  ): Promise<void> {
    await this.prisma.userRefreshToken.update({
      where: {
        user_id,
      },
      data: {
        hashed_token: hashedRefreshToken,
      },
    });
  }

  async getRefreshToken(user_id: string): Promise<UserRefreshToken> {
    return await this.prisma.userRefreshToken.findFirst({ where: { user_id } });
  }

  async deleteRefreshToken(user_id: string): Promise<void> {
    await this.prisma.userRefreshToken.deleteMany({
      where: {
        user_id,
      },
    });
  }

  async insertRefreshToken(
    hashedRefreshToken: string,
    user_id: string,
  ): Promise<void> {
    await this.prisma.userRefreshToken.create({
      data: {
        hashed_token: hashedRefreshToken,
        user_id,
      },
    });
  }
}
