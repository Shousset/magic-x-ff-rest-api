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

    findAll(): Promise<Card[]> {
        return this.prisma.card.findMany({
            orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        });
    }

    async findOne(idValue: string): Promise<Card> {
        const id = this.parseId(idValue);

        const card = await this.prisma.card.findUnique({ where: { id } });

        if (!card) {
            throw new NotFoundException('Card not found');
        }

        return card;
    }

    async create(createCardDto: CreateCardDto): Promise<Card> {
        this.validateCreate(createCardDto);

        try {
            return await this.prisma.card.create({
                data: {
                    ...createCardDto,
                    setCode: createCardDto.setCode ?? 'FIN',
                },
            });
        } catch (error) {
            this.handleUniqueConstraint(error);
        }
    }

    async update(idValue: string, updateCardDto: UpdateCardDto): Promise<Card> {
        const id = this.parseId(idValue);
        await this.findOne(idValue);
        this.validateUpdate(updateCardDto);

        try {
            return await this.prisma.card.update({
                where: { id },
                data: updateCardDto,
            });
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

    private handleUniqueConstraint(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictException('A card with the same setCode and collectorNumber already exists');
        }

        throw error;
    }
}