import { User } from '../../users/domain/entities/user.entity';

export class AuthRequestDto extends Request {
  user: User;
}
