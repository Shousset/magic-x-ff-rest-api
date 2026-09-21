import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
export declare class CardsController {
    private readonly cardsService;
    constructor(cardsService: CardsService);
    findAll(): Promise<{
        data: ({
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
        })[];
    }>;
    findOne(id: string): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
