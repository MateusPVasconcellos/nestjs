import { UserPayload } from '../models/user-payload.model';
import { UserToken } from '../models/user-token.model';
import { User } from 'src/users/domain/entities/user.entity';
import { JwtService as JwtNest } from '@nestjs/jwt';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';

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
        privateKey: this.configService.get('jwt.privateKey'),
        expiresIn: this.configService.get('jwt.accessExpiresIn'),
        algorithm: 'RS256',
      }),
      this.jwtNest.sign(tokenPayload, {
        privateKey: this.configService.get('jwt.refreshPrivateKey'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
        algorithm: 'RS256',
      }),
    ];
    return {
      access_token,
      refresh_token,
    };
  }

  async hashToken(token: string) {
    const hashedToken = await this.crypt.encrypt(
      token,
      this.configService.get('jwt.saltRounds'),
    );
    return hashedToken;
  }

  generateActivateToken(email: string) {
    const tokenPayload = {
      sub: email,
    };

    const activateToken = this.jwtNest.sign(tokenPayload, {
      privateKey: this.configService.get('jwt.accessPrivateKey'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
      algorithm: 'RS256',
    });

    return activateToken;
  }
}
