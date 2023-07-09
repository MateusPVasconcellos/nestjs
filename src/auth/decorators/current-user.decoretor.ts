import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/domain/entities/user.entity';
import { AuthRequestDto } from '../dto/auth-request.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequestDto>();

    return request.user;
  },
);
