import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Card, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.card.findMany({
            include: { rarity: true, cardType: true },
            orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        });
    }

    async findOne(idValue: string) {
        const id = this.parseId(idValue);

        const card = await this.prisma.card.findUnique({
            where: { id },
            include: { rarity: true, cardType: true },
        });

        if (!card) {
            throw new NotFoundException('Card not found');
        }

        return card;
    }

    async create(createCardDto: CreateCardDto) {
        this.validateCreate(createCardDto);
        const { rarityId, cardTypeId } = await this.getCatalogIds(
            createCardDto.rarity,
            createCardDto.type,
        );

        try {
            const card = await this.prisma.card.create({
                data: {
                    name: createCardDto.name,
                    manaCost: createCardDto.manaCost,
                    oracleText: createCardDto.oracleText,
                    power: createCardDto.power,
                    toughness: createCardDto.toughness,
                    setCode: createCardDto.setCode ?? 'FIN',
                    collectorNumber: createCardDto.collectorNumber,
                    artist: createCardDto.artist,
                    imageUrl: createCardDto.imageUrl,
                    displayOrder: createCardDto.displayOrder ?? 0,
                    rarityId,
                    cardTypeId,
                },
            });

            return this.findOne(String(card.id));
        } catch (error) {
            this.handleUniqueConstraint(error);
        }
    }

    async update(idValue: string, updateCardDto: UpdateCardDto) {
        const id = this.parseId(idValue);
        await this.findOne(idValue);
        this.validateUpdate(updateCardDto);
        const { type, rarity, ...cardFields } = updateCardDto;
        const data: Prisma.CardUpdateInput = cardFields;

        if (type !== undefined) {
            const { cardTypeId } = await this.getCatalogIds(
                undefined,
                type,
            );
            data.cardType = { connect: { id: cardTypeId } };
        }

        if (rarity !== undefined) {
            const { rarityId } = await this.getCatalogIds(
                rarity,
                undefined,
            );
            data.rarity = { connect: { id: rarityId } };
        }

        try {
            await this.prisma.card.update({
                where: { id },
                data,
            });

            return this.findOne(idValue);
        } catch (error) {
            this.handleUniqueConstraint(error);
        }
    }

    async remove(idValue: string): Promise<{ message: string }> {
        const id = this.parseId(idValue);
        await this.findOne(idValue);
        await this.prisma.card.delete({ where: { id } });

        return { message: 'Card deleted successfully' };
    }

    private parseId(idValue: string): number {
        const id = Number(idValue);

        if (!Number.isInteger(id) || id < 1) {
            throw new BadRequestException('Card id must be a positive integer');
        }

        return id;
    }

    private validateCreate(card: CreateCardDto): void {
        this.validateRequiredText(card.name, 'name');
        this.validateRequiredText(card.type, 'type');
        this.validateRequiredText(card.rarity, 'rarity');
        this.validateRequiredText(card.collectorNumber, 'collectorNumber');
        this.validateOptionalFields(card);
    }

    private validateUpdate(card: UpdateCardDto): void {
        if (Object.keys(card).length === 0) {
            throw new BadRequestException('At least one field is required');
        }

        if (card.name !== undefined) {
            this.validateRequiredText(card.name, 'name');
        }
        if (card.type !== undefined) {
            this.validateRequiredText(card.type, 'type');
        }
        if (card.rarity !== undefined) {
            this.validateRequiredText(card.rarity, 'rarity');
        }
        if (card.collectorNumber !== undefined) {
            this.validateRequiredText(card.collectorNumber, 'collectorNumber');
        }
        this.validateOptionalFields(card);
    }

    private validateOptionalFields(card: CreateCardDto | UpdateCardDto): void {
        if (card.setCode !== undefined && card.setCode !== null && !/^[A-Z0-9]{2,5}$/.test(card.setCode)) {
            throw new BadRequestException('setCode must contain 2 to 5 uppercase letters or numbers');
        }

        if (card.imageUrl !== undefined && card.imageUrl !== null) {
            try {
                const url = new URL(card.imageUrl);
                if (!['http:', 'https:'].includes(url.protocol)) {
                    throw new Error();
                }
            } catch {
                throw new BadRequestException('imageUrl must be a valid HTTP or HTTPS URL');
            }
        }

        if (card.displayOrder !== undefined && (!Number.isInteger(card.displayOrder) || card.displayOrder < 0)) {
            throw new BadRequestException('displayOrder must be a non-negative integer');
        }
    }

    private validateRequiredText(value: string | null | undefined, field: string): void {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new BadRequestException(`${field} is required`);
        }
    }

    private async getCatalogIds(
        rarityName: string | null | undefined,
        cardTypeName: string | null | undefined,
    ): Promise<{ rarityId: number; cardTypeId: number }> {
        const rarity = rarityName
            ? await this.prisma.rarity.upsert({
                  where: { name: rarityName },
                  create: { name: rarityName },
                  update: {},
              })
            : undefined;
        const cardType = cardTypeName
            ? await this.prisma.cardType.upsert({
                  where: { name: cardTypeName },
                  create: { name: cardTypeName },
                  update: {},
              })
            : undefined;

        return {
            rarityId: rarity?.id ?? 0,
            cardTypeId: cardType?.id ?? 0,
        };
    }

    private handleUniqueConstraint(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictException('A card with the same setCode and collectorNumber already exists');
        }

        throw error;
    }
}