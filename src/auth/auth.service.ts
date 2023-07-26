import {
  BadRequestException,
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
import { AuthProducerService } from './jobs/auth-producer.service';
import { LoggerService } from 'src/shared/logger/logger.service';
import { validate } from 'class-validator';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly crypt: CryptService,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly authProducer: AuthProducerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = AuthService.name;
  }

  async signin(user: User): Promise<UserToken> {
    const tokens = this.jwtService.generateTokens(user);

    const refreshTokenTrim = tokens.refresh_token.substring(
      tokens.refresh_token.length - 72,
    );
    const hashedRefreshToken = await this.jwtService.hashRefreshToken(
      refreshTokenTrim,
    );

    const oldToken = await this.authRepository.getRefreshToken(user.id);

    if (!oldToken) {
      await this.authRepository.insertRefreshToken(hashedRefreshToken, user.id);
    }

    await this.authRepository.updateRefreshToken(hashedRefreshToken, user.id);

    this.loggerService.info(`USER SIGNIN: ${JSON.stringify(user)}`);
    return tokens;
  }

  async signup(createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    await this.authProducer.sendActivateEmail(createUserDto);
    this.loggerService.info(`USER SIGNUP: ${JSON.stringify(createUserDto)}`);
  }

  async refresh(user: User) {
    const tokens = this.jwtService.generateTokens(user);

    const refreshTokenTrim = tokens.refresh_token.substring(
      tokens.refresh_token.length - 72,
    );

    const hashedRefreshToken = await this.jwtService.hashRefreshToken(
      refreshTokenTrim,
    );

    await this.authRepository.updateRefreshToken(hashedRefreshToken, user.id);
    return tokens;
  }

  async logout(user: User) {
    await this.authRepository.deleteRefreshToken(user.id);
  }

  async validateUser(email: string, password: string) {
    const loginRequestBody = new SigninDto();
    loginRequestBody.email = email;
    loginRequestBody.password = password;

    const validations = await validate(loginRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }

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

  async validateRefreshToken(token: string, user_id: string) {
    const storedToken = await this.authRepository.getRefreshToken(user_id);

    if (storedToken) {
      const isTokenValid = await this.crypt.compare(
        token.substring(token.length - 72),
        storedToken.hashed_token,
      );

      if (!isTokenValid) {
        throw new UnauthorizedException();
      }
    }
  }
}
