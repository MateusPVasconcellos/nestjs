import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
  async hash(plain: string, saltRounds: number) {
    return await bcrypt.hashSync(plain, saltRounds);
  }

  async compare(plain: string, hash: string) {
    const comparison = await bcrypt.compareSync(plain, hash);
    return comparison;
  }
}
