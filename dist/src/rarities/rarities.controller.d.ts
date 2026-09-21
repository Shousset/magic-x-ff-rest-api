import { RaritiesService } from './rarities.service';
export declare class RaritiesController {
    private readonly raritiesService;
    constructor(raritiesService: RaritiesService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
}
