import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../models/user-payload.model';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '1234',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    return {
      id: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}
