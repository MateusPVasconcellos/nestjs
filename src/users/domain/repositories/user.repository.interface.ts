import { Prisma } from '@prisma/client';
import { User } from '../entities/user.entity';

export interface UsersRepository {
  create(params: { data: Prisma.UserCreateInput }): Promise<User>;
  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User>;
  findOne(params: { where: Prisma.UserWhereUniqueInput }): Promise<User>;
  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]>;
}

export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
