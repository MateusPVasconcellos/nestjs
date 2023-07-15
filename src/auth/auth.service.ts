import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { User } from 'src/users/domain/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserToken } from './models/user-token.model';
import {
  AUTH_REPOSITORY_TOKEN,
  AuthRepository,
} from './domain/repositories/auth.repository.interface';
import { JwtService } from './services/jwt.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersProducerService } from 'src/jobs/users-producer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly crypt: CryptService,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly usersProducer: UsersProducerService,
  ) {}

  async signin(user: User): Promise<UserToken> {
    const tokens = this.jwtService.generateTokens(user);

    const hashedRefreshToken = await this.jwtService.hashRefreshToken(
      tokens.refresh_token,
    );

    await this.authRepository.saveHashedRefreshToken(hashedRefreshToken, user);

    return tokens;
  }

  async signup(createUserDto: CreateUserDto) {
    await this.usersProducer.signup(createUserDto);
  }

  async refresh(user: User) {
    const tokens = this.jwtService.generateTokens(user);

    const hashedRefreshToken = await this.jwtService.hashRefreshToken(
      tokens.refresh_token,
    );

    await this.authRepository.saveHashedRefreshToken(hashedRefreshToken, user);

    return tokens;
  }

  async logout(user: User) {
    await this.authRepository.deleteRefreshToken(user);
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
