import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Marca un handler o un controller entero como restringido a los roles
 * indicados. Debe usarse siempre junto con JwtAuthGuard + RolesGuard, y en
 * ese orden, para que `request.user` ya exista cuando RolesGuard lo lea.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
