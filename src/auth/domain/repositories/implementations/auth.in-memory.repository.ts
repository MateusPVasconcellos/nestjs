import { User } from 'src/users/domain/entities/user.entity';
import { AuthRepository } from '../auth.repository.interface';
import { UserRefreshToken } from '@prisma/client';

export class AuthInMemoryRepository implements AuthRepository {
  saveHashedRefreshToken(
    hashedRefreshToken: string,
    user: User,
  ): Promise<UserRefreshToken> {
    throw new Error('Method not implemented.');
  }
}
