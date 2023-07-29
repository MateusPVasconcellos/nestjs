import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { User } from 'src/users/domain/entities/user.entity';
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
import {
  USERS_REPOSITORY_TOKEN,
  UsersRepository,
} from 'src/users/domain/repositories/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly crypt: CryptService,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly authProducer: AuthProducerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = AuthService.name;
  }

  async signin(user: User): Promise<UserToken> {
    const storedUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

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
    const hashedPassword = await this.crypt.hash(createUserDto.password, 8);
    createUserDto.password = hashedPassword;

    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new ConflictException('There is already a user with this email.');
    }

    const createdUser = await this.userRepository.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        userDetail: {
          create: {
            name: createUserDto.name,
            type_person: createUserDto.type_person,
            cpf_cnpj: createUserDto.cpf_cnpj,
          },
        },
        roleEnum: { connect: { id: 'clkmr3its0000ty1ovaizqdx4' } },
      },
    });

    const activateToken = this.jwtService.generateActivateToken(
      createdUser.email,
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

  async activate(token: string) {
    const { sub } = this.jwtService.decodeToken(token);
    const user = await this.userRepository.findOne({ where: { email: sub } });

    if (user.active) throw new UnauthorizedException();

    const params = { where: { email: sub }, data: { active: true } };
    return this.userRepository.update(params);
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

    const user = await this.userRepository.findOne({ where: { email } });
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
