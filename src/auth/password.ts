import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const deriveKey = promisify(scrypt);

// scrypt$<N>$<r>$<p>$<salt hex 32 chars>$<key hex 128 chars>
const HASH_PATTERN = /^scrypt\$16384\$8\$1\$([a-f0-9]{32})\$([a-f0-9]{128})$/;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const key = (await deriveKey(password, salt, 64)) as Buffer;
  return `scrypt$16384$8$1$${salt}$${key.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (typeof hash !== 'string') {
    return false;
  }

  const match = HASH_PATTERN.exec(hash);
  if (!match) {
    return false;
  }

  const [, salt, storedKeyHex] = match;

  try {
    // El salt se pasa como texto hexadecimal, igual que al crear el usuario.
    const candidateKey = (await deriveKey(password, salt, 64)) as Buffer;
    const storedKey = Buffer.from(storedKeyHex, 'hex');
    return timingSafeEqual(candidateKey, storedKey);
  } catch {
    return false;
  }
}

/**
 * Hash "de relleno" con el mismo formato que uno real, usado cuando el
 * username no existe. Así `verifyPassword` siempre hace el mismo trabajo
 * criptográfico y el 401 de login no revela por tiempo de respuesta si la
 * cuenta existe o no.
 */
export const dummyHash =
  'scrypt$16384$8$1$' + '0'.repeat(32) + '$' + '0'.repeat(128);
