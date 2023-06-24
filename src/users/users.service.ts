import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptService } from 'src/shared/crypt/crypt.service';
import { UsersProducerService } from 'src/jobs/users-producer.service';
import { UsersRepository } from './domain/repositories/user.repository.interface';
import { User } from './domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private crypt: CryptService,
    private usersProducer: UsersProducerService,
    private userRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new ConflictException('There is already a user with this email.');
    }

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
}
