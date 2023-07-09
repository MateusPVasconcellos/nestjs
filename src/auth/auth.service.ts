import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { User } from 'src/users/domain/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/user-token.model';
import { UserPayload } from './models/user-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly crypt: CryptService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
      refresh_token: '',
    };
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
