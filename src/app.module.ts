import { Global, Module } from '@nestjs/common/decorators/modules';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [UsersModule],
})
export class AppModule {}
