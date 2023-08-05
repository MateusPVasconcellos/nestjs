import { UserPayload } from '../models/user-payload.model';
import { UserToken } from '../models/user-token.model';
import { User } from 'src/users/domain/entities/user.entity';
import { JwtService as JwtNest } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtNest: JwtNest,
    private readonly configService: ConfigService,
  ) {}
  async generateTokens(user: User): Promise<UserToken> {
    const tokenPayload: UserPayload = {
      sub: user.id,
      email: user.email,
    };

    const jwtJti = uuidv4();

    const refreshTokenPayload: UserPayload = {
      sub: user.id,
      email: user.email,
      jti: jwtJti,
    };

    const [access_token, refresh_token] = [
      this.jwtNest.sign(tokenPayload, {
        privateKey: this.configService.get('jwt.accessPrivateKey'),
        expiresIn: this.configService.get('jwt.accessExpiresIn'),
        algorithm: 'RS256',
      }),
      this.jwtNest.sign(refreshTokenPayload, {
        privateKey: this.configService.get('jwt.refreshPrivateKey'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
        algorithm: 'RS256',
      }),
    ];
    return {
      access_token,
      refresh_token,
      jti: jwtJti,
    };
  }

  decodeToken(token: string): UserPayload {
    const decodedToken = this.jwtNest.decode(token);
    return decodedToken as UserPayload;
  }

  verifyToken(token: string, key: string): UserPayload {
    const decodedToken = this.jwtNest.verify(token, { secret: key });
    return decodedToken as UserPayload;
  }

  generateActivateToken(email: string) {
    const tokenPayload = {
      email: email,
    };

    const activateToken = this.jwtNest.sign(tokenPayload, {
      privateKey: this.configService.get('jwt.activatePrivateKey'),
      expiresIn: this.configService.get('jwt.activateExpiresIn'),
      algorithm: 'RS256',
    });

    return activateToken;
  }

  generateRecoveryToken(hash: string, email: string) {
    const tokenPayload = {
      email: email,
    };
    const recoveryToken = this.jwtNest.sign(tokenPayload, {
      secret: hash,
      expiresIn: this.configService.get('jwt.recoveryExpiresIn'),
    });

    return recoveryToken;
  }
}
