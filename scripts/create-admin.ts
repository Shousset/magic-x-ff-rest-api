import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../src/auth/password';
import { UserRole } from '@prisma/client';

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || username.trim().length === 0) {
    throw new Error('Set ADMIN_USERNAME before running this script');
  }
  if (!password || password.trim().length < 8) {
    throw new Error(
      'Set ADMIN_PASSWORD (min 8 characters) before running this script',
    );
  }

  const prisma = new PrismaService();
  await prisma.onModuleInit();

  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { username },
    create: { username, passwordHash, role: UserRole.ADMINISTRATOR },
    update: { passwordHash, role: UserRole.ADMINISTRATOR },
    select: { id: true, username: true, role: true },
  });

  console.log('Administrator ready:', admin);
  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error('Failed to create administrator:', error);
  process.exitCode = 1;
});
