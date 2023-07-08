import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/domain/entities/user.entity';
import { AuthRequest } from '../models/auth-request.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
