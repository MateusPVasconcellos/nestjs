import { User } from 'src/users/domain/entities/user.entity';
import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { AuthRepository } from '../auth.repository.interface';

export class AuthInMemoryRepository implements AuthRepository {
  deleteRefreshToken(user: User): void {
    throw new Error('Method not implemented.');
  }
  saveHashedRefreshToken(
    hashedRefreshToken: string,
    user: User,
  ): Promise<UserRefreshToken> {
    throw new Error('Method not implemented.');
  }
}
