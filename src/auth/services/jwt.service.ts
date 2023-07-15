import { Injectable } from '@nestjs/common';
import { UserPayload } from '../models/user-payload.model';
import { UserToken } from '../models/user-token.model';
import { User } from 'src/users/domain/entities/user.entity';
import { JwtService as JwtNest } from '@nestjs/jwt';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtNest: JwtNest,
    private readonly crypt: CryptService,
    private readonly configService: ConfigService,
  ) {}
  generateTokens(user: User): UserToken {
    const tokenPayload: UserPayload = {
      sub: user.id,
      email: user.email,
    };

    const [access_token, refresh_token] = [
      this.jwtNest.sign(tokenPayload, {
        secret: this.configService.get('jwt.publicKey'),
        expiresIn: this.configService.get('jwt.accessExpiresIn'),
      }),
      this.jwtNest.sign(tokenPayload, {
        secret: this.configService.get('jwt.publicKey'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
    ];

    return {
      access_token,
      refresh_token,
    };
  }

  async hashRefreshToken(refresh_token: UserToken['refresh_token']) {
    const hashedToken = await this.crypt.encrypt(
      refresh_token,
      this.configService.get('jwt.saltRounds'),
    );
    return hashedToken;
  }
}
