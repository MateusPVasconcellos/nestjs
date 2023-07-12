import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  publicKey: process.env.JWT_PUBLIC_KEY,
  refreshExpiresIn: process.env.MAIL_PORT,
  accessExpiresIn: +process.env.MAIL_PORT,
  saltRounds: +process.env.JWT_SALT_ROUNDS,
}));
