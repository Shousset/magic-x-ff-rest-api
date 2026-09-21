import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
type PublicUser = {
    id: string;
    username: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<PublicUser>;
    findOne(id: string): Promise<PublicUser>;
    findCredentialsByUsername(username: string): Prisma.Prisma__UserClient<{
        id: string;
        passwordHash: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
export {};
