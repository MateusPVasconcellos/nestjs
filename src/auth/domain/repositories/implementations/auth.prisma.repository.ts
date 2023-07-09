import { User } from 'src/users/domain/entities/user.entity';
import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { PrismaService } from 'src/database/prisma.service';
import { AuthRepository } from '../auth.repository.interface';

export class AuthPrismaRepository implements AuthRepository {
  constructor(private prisma: PrismaService) {}

  async saveHashedRefreshToken(
    hashedRefreshToken: string,
    user: User,
  ): Promise<UserRefreshToken> {
    const newHashedRefreshToken = await this.prisma.userRefreshToken.create({
      data: {
        hashed_token: hashedRefreshToken,
        user_id: user.id,
      },
    });

    return newHashedRefreshToken;
  }
}
