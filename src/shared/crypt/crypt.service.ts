import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
  async encrypt(plain: string, saltRounds: number) {
    return await bcrypt.hash(plain, saltRounds);
  }

  async compare(plain: string, hash: string) {
    const comparison = await bcrypt.compare(plain, hash);
    if (comparison) {
      return true;
    }
    return false;
  }
}
