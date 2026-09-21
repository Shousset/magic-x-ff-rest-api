import { CollectionsService } from './collections.service';
import { CreateCollectionEntryDto } from './dto/create-collection-entry.dto';
import { UpdateCollectionEntryDto } from './dto/update-collection-entry.dto';
type AuthenticatedRequest = {
    user: {
        id: string;
    };
};
export declare class CollectionsController {
    private readonly collectionsService;
    constructor(collectionsService: CollectionsService);
    findAll(request: AuthenticatedRequest): import("@prisma/client").Prisma.PrismaPromise<({
        card: {
            rarity: {
                id: number;
                name: string;
            };
            cardType: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            power: string | null;
            toughness: string | null;
            artist: string | null;
            name: string;
            manaCost: string | null;
            oracleText: string | null;
            setCode: string;
            collectorNumber: string;
            imageUrl: string | null;
            displayOrder: number;
            rarityId: number;
            cardTypeId: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cardId: number;
        quantity: number;
        isFoil: boolean;
        userId: string;
    })[]>;
    summary(request: AuthenticatedRequest): Promise<{
        totalCards: number;
        uniqueCards: number;
        byRarity: Record<string, number>;
    }>;
    create(request: AuthenticatedRequest, dto: CreateCollectionEntryDto): Promise<{
        card: {
            rarity: {
                id: number;
                name: string;
            };
            cardType: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            power: string | null;
            toughness: string | null;
            artist: string | null;
            name: string;
            manaCost: string | null;
            oracleText: string | null;
            setCode: string;
            collectorNumber: string;
            imageUrl: string | null;
            displayOrder: number;
            rarityId: number;
            cardTypeId: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cardId: number;
        quantity: number;
        isFoil: boolean;
        userId: string;
    }>;
    update(request: AuthenticatedRequest, id: string, dto: UpdateCollectionEntryDto): Promise<{
        card: {
            rarity: {
                id: number;
                name: string;
            };
            cardType: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            power: string | null;
            toughness: string | null;
            artist: string | null;
            name: string;
            manaCost: string | null;
            oracleText: string | null;
            setCode: string;
            collectorNumber: string;
            imageUrl: string | null;
            displayOrder: number;
            rarityId: number;
            cardTypeId: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cardId: number;
        quantity: number;
        isFoil: boolean;
        userId: string;
    }>;
    remove(request: AuthenticatedRequest, id: string): Promise<void>;
}
export {};
