import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  publicKey: process.env.JWT_PUBLIC_KEY,
  refreshExpiresIn: +process.env.JWT_REFRESH_EXPIRES_IN,
  accessExpiresIn: +process.env.JWT_EXPIRES_IN,
  saltRounds: +process.env.JWT_SALT_ROUNDS,
}));
