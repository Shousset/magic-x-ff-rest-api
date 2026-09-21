import 'dotenv/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export function jwtOptions(): JwtModuleOptions {
  const secret =
    process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-123456';
  const expiresInRaw = process.env.JWT_EXPIRES_IN || '86400';

  const expiresIn = Number(expiresInRaw);
  const validExpiresIn =
    Number.isInteger(expiresIn) && expiresIn > 0 ? expiresIn : 86400;

  return {
    secret,
    signOptions: {
      algorithm: 'HS256',
      expiresIn: validExpiresIn,
    },
  };
}
