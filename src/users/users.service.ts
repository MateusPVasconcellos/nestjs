import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CryptHelper } from 'src/shared/crypt-helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExists) {
      throw new ConflictException('There is already a user with this email.');
    }

    const hashedPassword = await CryptHelper.encrypt(createUserDto.password, 8);

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

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

    const hashedNewPassword = await CryptHelper.encrypt(
      updateUserDto.password,
      8,
    );

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: updateUserDto.name,
        password: hashedNewPassword,
      },
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
