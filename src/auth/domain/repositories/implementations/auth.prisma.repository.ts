import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { PrismaService } from 'src/database/prisma.service';
import { AuthRepository } from '../auth.repository.interface';

export class AuthPrismaRepository implements AuthRepository {
  constructor(private prisma: PrismaService) {}
  async updateRefreshTokenJti(
    hashedTokenJti: string,
    user_id: string,
  ): Promise<void> {
    await this.prisma.userRefreshToken.update({
      where: {
        user_id,
      },
      data: {
        jti_refresh_token: hashedTokenJti,
      },
    });
  }

  async getRefreshTokenJti(user_id: string): Promise<UserRefreshToken> {
    return await this.prisma.userRefreshToken.findFirst({ where: { user_id } });
  }

  async deleteRefreshTokenJti(user_id: string): Promise<void> {
    await this.prisma.userRefreshToken.deleteMany({
      where: {
        user_id,
      },
    });
  }

  async insertRefreshTokenJti(
    hashedTokenJti: string,
    user_id: string,
  ): Promise<void> {
    await this.prisma.userRefreshToken.create({
      data: {
        jti_refresh_token: hashedTokenJti,
        user_id,
      },
    });
  }
}
