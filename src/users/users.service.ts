import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password';
import { CreateUserDto } from './dto/create-user.dto';

type PublicUser = {
  id: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

function toPublicUser(user: PublicUser): PublicUser {
  const { id, username, role, createdAt, updatedAt } = user;
  return { id, username, role, createdAt, updatedAt };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const passwordHash = await hashPassword(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: { username: dto.username, role: dto.role, passwordHash },
        select: PUBLIC_USER_SELECT,
      });

      return toPublicUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: PUBLIC_USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toPublicUser(user);
  }

  /**
   * Consulta interna, no expuesta como endpoint. Auth necesita solo el id
   * (para firmar el token) y el hash (para verificar la contraseña); no
   * necesita username, rol ni fechas durante el login.
   */
  findCredentialsByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: { id: true, passwordHash: true },
    });
  }
}
