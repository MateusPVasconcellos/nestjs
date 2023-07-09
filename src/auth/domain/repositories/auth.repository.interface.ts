import { User } from 'src/users/domain/entities/user.entity';
import { UserRefreshToken } from '../entities/user-refresh-token.entity';

export interface AuthRepository {
  saveHashedRefreshToken(
    hashedRefreshToken: string,
    user: User,
  ): Promise<UserRefreshToken>;
  deleteRefreshToken(user: User): void;
}

export const AUTH_REPOSITORY_TOKEN = 'auth-repository-token';
