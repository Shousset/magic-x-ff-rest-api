import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollectionEntryDto } from './dto/create-collection-entry.dto';
import { UpdateCollectionEntryDto } from './dto/update-collection-entry.dto';
export declare class CollectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllForUser(userId: string): Prisma.PrismaPromise<({
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
    create(userId: string, dto: CreateCollectionEntryDto): Promise<{
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
    update(userId: string, id: string, dto: UpdateCollectionEntryDto): Promise<{
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
    remove(userId: string, id: string): Promise<void>;
    summary(userId: string): Promise<{
        totalCards: number;
        uniqueCards: number;
        byRarity: Record<string, number>;
    }>;
    private findOwnedOrFail;
}
