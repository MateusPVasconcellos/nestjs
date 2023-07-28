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

    const tokens = await this.jwtService.generateTokens(user);

    const oldToken = await this.authRepository.getRefreshTokenJti(user.id);

    if (!oldToken) {
      await this.authRepository.insertRefreshTokenJti(tokens.jti, user.id);
    }

    await this.authRepository.updateRefreshTokenJti(tokens.jti, user.id);

    this.loggerService.info(`USER SIGNIN: ${JSON.stringify(user)}`);
    tokens.jti = undefined;
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
    const tokens = await this.jwtService.generateTokens(user);
    await this.authRepository.updateRefreshTokenJti(tokens.jti, user.id);

    this.loggerService.info(`USER REFRESH: ${JSON.stringify(user)}`);
    return tokens;
  }

  async signout(user: User) {
    this.loggerService.info(`USER SIGNOUT: ${JSON.stringify(user)}`);
    await this.authRepository.deleteRefreshTokenJti(user.id);
  }

  async activate(user: User) {
    await this.usersService
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
    const { jti_refresh_token } = await this.authRepository.getRefreshTokenJti(
      user_id,
    );

    if (jti_refresh_token) {
      const decodedToken = this.jwtService.decodeToken(token);
      if (jti_refresh_token !== decodedToken.jti)
        throw new UnauthorizedException();
    }
  }
}
