/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/users/domain/entities/user.entity';
import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { AuthRepository } from '../auth.repository.interface';

export class AuthInMemoryRepository implements AuthRepository {
  updateRefreshToken(
    hashedRefreshToken: string,
    user_id: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getRefreshToken(user_id: string): Promise<UserRefreshToken> {
    throw new Error('Method not implemented.');
  }
  deleteRefreshToken(user_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  insertRefreshToken(
    hashedRefreshToken: string,
    user_id: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
