import * as bcrypt from 'bcrypt';

export class CryptHelper {
  static async encrypt(plain: string, saltRounds: number) {
    return await bcrypt.hash(plain, saltRounds);
  }

  static async compare(plain: string, hash: string) {
    const comparison = await bcrypt.compare(plain, hash);
    if (comparison) {
      return true;
    }
    return false;
  }
}
