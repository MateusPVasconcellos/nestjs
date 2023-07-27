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
import { UserCreatedEvent } from './events/user-created.event';

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
    const storedUser = await this.usersService.findByEmail(user.email);
    if (!storedUser.active) {
      throw new UnauthorizedException('User is not active');
    }

    const tokens = this.jwtService.generateTokens(user);

    const refreshTokenTrim = tokens.refresh_token.substring(
      tokens.refresh_token.length - 72,
    );
    const hashedRefreshToken = await this.jwtService.hashToken(
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

    const activateToken = this.jwtService.generateActivateToken(
      createUserDto.email,
    );

    await this.authProducer.sendActivateEmail(
      new UserCreatedEvent(
        createUserDto.name,
        createUserDto.email,
        activateToken,
      ),
    );
    this.loggerService.info(`USER SIGNUP: ${JSON.stringify(createUserDto)}`);
  }

  async refresh(user: User) {
    const tokens = this.jwtService.generateTokens(user);

    const refreshTokenTrim = tokens.refresh_token.substring(
      tokens.refresh_token.length - 72,
    );

    const hashedRefreshToken = await this.jwtService.hashToken(
      refreshTokenTrim,
    );

    await this.authRepository.updateRefreshToken(hashedRefreshToken, user.id);
    this.loggerService.info(`USER REFRESH: ${JSON.stringify(user)}`);
    return tokens;
  }

  async signout(user: User) {
    this.loggerService.info(`USER SIGNOUT: ${JSON.stringify(user)}`);
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
