import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';
import { hashPassword } from '../src/auth/password';
import { UserRole } from '@prisma/client';

async function seedUsers() {
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  console.log('🌱 Sembrando usuarios de prueba...');

  // 1. Usuario Jugador de prueba
  const playerPasswordHash = await hashPassword('Password123!');
  const player = await prisma.user.upsert({
    where: { username: 'jugador_prueba' },
    create: {
      username: 'jugador_prueba',
      passwordHash: playerPasswordHash,
      role: UserRole.PLAYER,
    },
    update: {
      passwordHash: playerPasswordHash,
      role: UserRole.PLAYER,
    },
    select: { id: true, username: true, role: true },
  });

  // 2. Usuario Administrador de prueba
  const adminPasswordHash = await hashPassword('AdminPassword123!');
  const admin = await prisma.user.upsert({
    where: { username: 'admin_finalfantasy' },
    create: {
      username: 'admin_finalfantasy',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMINISTRATOR,
    },
    update: {
      passwordHash: adminPasswordHash,
      role: UserRole.ADMINISTRATOR,
    },
    select: { id: true, username: true, role: true },
  });

  console.log('✅ Usuario Jugador listo:', player);
  console.log('✅ Usuario Administrador listo:', admin);

  await prisma.$disconnect();
}

seedUsers().catch((error: unknown) => {
  console.error('❌ Error al sembrar usuarios:', error);
  process.exitCode = 1;
});
