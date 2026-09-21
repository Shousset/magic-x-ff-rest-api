"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let CardsService = class CardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(filters = {}) {
        const search = filters.search?.trim();
        const rarity = filters.rarity?.trim();
        return this.prisma.card.findMany({
            where: {
                ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
                ...(rarity ? { rarity: { name: rarity } } : {}),
            },
            include: { rarity: true, cardType: true },
            orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        });
    }
    async findOne(idValue) {
        const id = this.parseId(idValue);
        const card = await this.prisma.card.findUnique({
            where: { id },
            include: { rarity: true, cardType: true },
        });
        if (!card) {
            throw new common_1.NotFoundException('Card not found');
        }
        return card;
    }
    async create(createCardDto) {
        this.validateCreate(createCardDto);
        const { rarityId, cardTypeId } = await this.getCatalogIds(createCardDto.rarity, createCardDto.type);
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
        }
        catch (error) {
            this.handleUniqueConstraint(error);
        }
    }
    async update(idValue, updateCardDto) {
        const id = this.parseId(idValue);
        await this.findOne(idValue);
        this.validateUpdate(updateCardDto);
        const { type, rarity, ...cardFields } = updateCardDto;
        const data = cardFields;
        if (type !== undefined) {
            const { cardTypeId } = await this.getCatalogIds(undefined, type);
            data.cardType = { connect: { id: cardTypeId } };
        }
        if (rarity !== undefined) {
            const { rarityId } = await this.getCatalogIds(rarity, undefined);
            data.rarity = { connect: { id: rarityId } };
        }
        try {
            await this.prisma.card.update({
                where: { id },
                data,
            });
            return this.findOne(idValue);
        }
        catch (error) {
            this.handleUniqueConstraint(error);
        }
    }
    async remove(idValue) {
        const id = this.parseId(idValue);
        await this.findOne(idValue);
        try {
            await this.prisma.card.delete({ where: { id } });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003') {
                throw new common_1.ConflictException('Card cannot be deleted because it is part of a collection');
            }
            throw error;
        }
        return { message: 'Card deleted successfully' };
    }
    parseId(idValue) {
        const id = Number(idValue);
        if (!Number.isInteger(id) || id < 1) {
            throw new common_1.BadRequestException('Card id must be a positive integer');
        }
        return id;
    }
    validateCreate(card) {
        this.validateRequiredText(card.name, 'name');
        this.validateRequiredText(card.type, 'type');
        this.validateRequiredText(card.rarity, 'rarity');
        this.validateRequiredText(card.collectorNumber, 'collectorNumber');
        this.validateOptionalFields(card);
    }
    validateUpdate(card) {
        if (Object.keys(card).length === 0) {
            throw new common_1.BadRequestException('At least one field is required');
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
    validateOptionalFields(card) {
        if (card.setCode !== undefined &&
            card.setCode !== null &&
            !/^[A-Z0-9]{2,5}$/.test(card.setCode)) {
            throw new common_1.BadRequestException('setCode must contain 2 to 5 uppercase letters or numbers');
        }
        if (card.imageUrl !== undefined && card.imageUrl !== null) {
            try {
                const url = new URL(card.imageUrl);
                if (!['http:', 'https:'].includes(url.protocol)) {
                    throw new Error();
                }
            }
            catch {
                throw new common_1.BadRequestException('imageUrl must be a valid HTTP or HTTPS URL');
            }
        }
        if (card.displayOrder !== undefined &&
            (!Number.isInteger(card.displayOrder) || card.displayOrder < 0)) {
            throw new common_1.BadRequestException('displayOrder must be a non-negative integer');
        }
    }
    validateRequiredText(value, field) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new common_1.BadRequestException(`${field} is required`);
        }
    }
    async getCatalogIds(rarityName, cardTypeName) {
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
    handleUniqueConstraint(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003') {
            throw new common_1.ConflictException('A card with the same setCode and collectorNumber already exists');
        }
        throw new common_1.ConflictException('A card with the same setCode and collectorNumber already exists');
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CardsService);
//# sourceMappingURL=cards.service.js.map