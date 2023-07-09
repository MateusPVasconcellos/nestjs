import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { User } from 'src/users/domain/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/user-token.model';
import { UserPayload } from './models/user-payload.model';
import { AuthRepository } from './domain/repositories/auth.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly crypt: CryptService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  private generateTokens(user: User): UserToken {
    const tokenPayload: UserPayload = {
      sub: user.id,
      email: user.email,
    };

    const [access_token, refresh_token] = [
      this.jwtService.sign(tokenPayload, { secret: '123', expiresIn: '1d' }),
      this.jwtService.sign(tokenPayload, { secret: '123', expiresIn: '7d' }),
    ];

    return {
      access_token,
      refresh_token,
    };
  }

  private async hashRefreshToken(refresh_token: UserToken['refresh_token']) {
    const hashedToken = await this.crypt.encrypt(refresh_token, 10);
    return hashedToken;
  }

  async signin(user: User): Promise<UserToken> {
    const tokens = this.generateTokens(user);

    const hashedRefreshToken = await this.hashRefreshToken(
      tokens.refresh_token,
    );

    await this.authRepository.saveHashedRefreshToken(hashedRefreshToken, user);

    return tokens;
  }

  signup(user: User) {
    throw new Error('Method not implemented.');
  }

  refresh(user: User) {
    throw new Error('Method not implemented.');
  }
  logout(user: User) {
    throw new Error('Method not implemented.');
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordValid = await this.crypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
