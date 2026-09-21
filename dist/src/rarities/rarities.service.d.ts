import { PrismaService } from '../../prisma/prisma.service';
export declare class RaritiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
}
