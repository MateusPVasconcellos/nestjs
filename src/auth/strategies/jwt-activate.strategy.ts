import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../models/user-payload.model';

@Injectable()
export class JwtActivateStrategy extends PassportStrategy(
  Strategy,
  'jwt-activate',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.activatePublicKey'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }
  async validate(payload: UserPayload) {
    return {
      email: payload.email,
    };
  }
}
