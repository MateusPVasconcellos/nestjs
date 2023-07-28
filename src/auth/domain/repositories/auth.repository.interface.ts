import { UserRefreshToken } from '../entities/user-refresh-token.entity';

export interface AuthRepository {
  updateRefreshTokenJti(hashedTokenJti: string, user_id: string): Promise<void>;
  insertRefreshTokenJti(hashedTokenJti: string, user_id: string): Promise<void>;
  deleteRefreshTokenJti(user_id: string): Promise<void>;
  getRefreshTokenJti(user_id: string): Promise<UserRefreshToken>;
}

export const AUTH_REPOSITORY_TOKEN = 'auth-repository-token';
