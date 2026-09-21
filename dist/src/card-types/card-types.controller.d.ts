import { CardTypesService } from './card-types.service';
export declare class CardTypesController {
    private readonly cardTypesService;
    constructor(cardTypesService: CardTypesService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
}
