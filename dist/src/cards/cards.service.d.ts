import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
export declare class CardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        search?: string;
        rarity?: string;
    }): Prisma.PrismaPromise<({
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
    })[]>;
    findOne(idValue: string): Promise<{
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
    }>;
    create(createCardDto: CreateCardDto): Promise<{
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
    }>;
    update(idValue: string, updateCardDto: UpdateCardDto): Promise<{
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
    }>;
    remove(idValue: string): Promise<{
        message: string;
    }>;
    private parseId;
    private validateCreate;
    private validateUpdate;
    private validateOptionalFields;
    private validateRequiredText;
    private getCatalogIds;
    private handleUniqueConstraint;
}
