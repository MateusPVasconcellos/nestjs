import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export abstract class UsersRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;

  abstract findByEmail(email: string): Promise<User>;

  abstract findById(id: string): Promise<User>;

  abstract findAll(): Promise<User[]>;

  abstract update(id, updateUserDto: UpdateUserDto): Promise<User>;

  abstract remove(id: string): Promise<User>;
}
