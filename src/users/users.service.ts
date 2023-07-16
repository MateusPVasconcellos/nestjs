import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { UsersProducerService } from 'src/jobs/users-producer.service';
import {
  USERS_REPOSITORY_TOKEN,
  UsersRepository,
} from './domain/repositories/user.repository.interface';
import { User } from './domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly userRepository: UsersRepository,
    private readonly crypt: CryptService,
    private readonly usersProducer: UsersProducerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.crypt.encrypt(createUserDto.password, 8);
    createUserDto.password = hashedPassword;

    const createdUser = await this.userRepository.create(createUserDto);

    await this.usersProducer.created(createUserDto);
    await this.usersProducer.sendMail(createUserDto);

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }
}
