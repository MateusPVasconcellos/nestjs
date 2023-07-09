import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'src/shared/enums/dataSource.enum';
import { PrismaService } from 'src/database/prisma.service';
import { AUTH_REPOSITORY_TOKEN } from '../domain/repositories/auth.repository.interface';
import { AuthPrismaRepository } from '../domain/repositories/implementations/auth.prisma.repository';
import { AuthInMemoryRepository } from '../domain/repositories/implementations/auth.in-memory.repository';

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: AUTH_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: AuthRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider),
      inject: [AuthRepoDependenciesProvider],
    },
    AuthRepoDependenciesProvider,
  ];
}

async function provideUsersRepositoryFactory(
  dependenciesProvider: AuthRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return new AuthPrismaRepository(dependenciesProvider.prisma);
    case DataSource.MEMORY:
    default:
      return new AuthInMemoryRepository();
  }
}

@Injectable()
export class AuthRepoDependenciesProvider {
  constructor(public prisma: PrismaService) {}
}
