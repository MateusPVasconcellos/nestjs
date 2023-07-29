import { UsersRepository } from '../user.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { User } from '../../entities/user.entity';
import { Prisma } from '@prisma/client';

export class UsersPrismaRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}
  create(params: { data: Prisma.UserCreateInput }): Promise<User> {
    return this.prisma.user.create({ data: params.data });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.prisma.user.update({ where: params.where, data: params.data });
  }

  findOne(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    return this.prisma.user.findFirst({ where: params.where });
  }

  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
  }
}
