import 'dotenv/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export function jwtOptions(): JwtModuleOptions {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error(
      'JWT_SECRET must be set to a secret of at least 32 characters. ' +
        'Generate one with: node -e "console.log(require("crypto").randomBytes(32).toString("hex"))"',
    );
  }
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
