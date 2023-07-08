import { User } from '../../users/domain/entities/user.entity';

export class AuthRequest extends Request {
  user: User;
}
