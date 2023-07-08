import { UserAddress } from './userAddress.entity';
import { UserDetail } from './userDetail.entity';
import { UserRole } from './userRole.entity';
import { UserToken } from './userToken.entity';

export class User {
  readonly id?: string;
  readonly password: string;
  readonly email: string;
  readonly role_id?: string;

  readonly userDetail?: UserDetail;
  readonly userAddress?: UserAddress;
  readonly userToken?: UserToken;
  readonly userRole?: UserRole;
}
