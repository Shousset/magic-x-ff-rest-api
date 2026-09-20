import type { JwtModuleOptions } from '@nestjs/jwt';

export function jwtOptions(): JwtModuleOptions {
  const secret = process.env.JWT_SECRET;
  const expiresInRaw = process.env.JWT_EXPIRES_IN;

  if (!secret || secret.trim().length === 0) {
    throw new Error('JWT_SECRET is not configured');
  }

  const expiresIn = Number(expiresInRaw);
  if (!Number.isInteger(expiresIn) || expiresIn <= 0) {
    throw new Error(
      'JWT_EXPIRES_IN must be a positive integer number of seconds (e.g. 3600)',
    );
  }

  return {
    secret,
    signOptions: {
      algorithm: 'HS256',
      expiresIn,
    },
  };
}
