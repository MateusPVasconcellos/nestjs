import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CryptHelper } from 'src/shared/crypt-helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository/users-repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new ConflictException('There is already a user with this email.');
    }

    const hashedPassword = await CryptHelper.encrypt(createUserDto.password, 8);

    createUserDto.password = hashedPassword;

    return this.usersRepository.create(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (updateUserDto.password && !updateUserDto.old_password) {
      throw new BadRequestException('Old password is required.');
    }

    const comparePasswords = await CryptHelper.compare(
      updateUserDto.old_password,
      user.password,
    );

    if (!comparePasswords) {
      throw new BadRequestException('Wrong old password.');
    }

    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string): Promise<User> {
    return this.usersRepository.remove(id);
  }
}
