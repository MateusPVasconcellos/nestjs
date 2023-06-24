import { Injectable, Provider } from '@nestjs/common';
import { USERS_REPOSITORY_TOKEN } from './user.repository.interface';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'src/shared/enums/datasource.enum';

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: UsersRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

async function provideUsersRepositoryFactory(
  dependenciesProvider: UsersRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.TYPEORM:
      return new UsersTypeOrmRepository(dependenciesProvider.typeOrmRepository);
    case DataSource.MEMORY:
    default:
      return new UsersInMemoryRepository();
  }
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(
    @InjectRepository(User)
    public typeOrmRepository: Repository<User>,
  ) {}
}
