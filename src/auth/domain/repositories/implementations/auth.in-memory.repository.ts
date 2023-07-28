/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/users/domain/entities/user.entity';
import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { AuthRepository } from '../auth.repository.interface';

export class AuthInMemoryRepository implements AuthRepository {
  updateRefreshTokenJti(
    hashedTokenJti: string,
    user_id: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  insertRefreshTokenJti(
    hashedTokenJti: string,
    user_id: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteRefreshTokenJti(user_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getRefreshTokenJti(user_id: string): Promise<UserRefreshToken> {
    throw new Error('Method not implemented.');
  }
}
