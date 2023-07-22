import { UserRefreshToken } from '../entities/user-refresh-token.entity';

export interface AuthRepository {
  updateRefreshToken(
    hashedRefreshToken: string,
    user_id: string,
  ): Promise<void>;
  insertRefreshToken(
    hashedRefreshToken: string,
    user_id: string,
  ): Promise<void>;
  deleteRefreshToken(user_id: string): Promise<void>;
  getRefreshToken(user_id: string): Promise<UserRefreshToken>;
}

export const AUTH_REPOSITORY_TOKEN = 'auth-repository-token';
