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
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const ENTRY_INCLUDE = {
    card: { include: { rarity: true, cardType: true } },
};
let CollectionsService = class CollectionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllForUser(userId) {
        return this.prisma.collectionEntry.findMany({
            where: { userId },
            include: ENTRY_INCLUDE,
            orderBy: { createdAt: 'asc' },
        });
    }
    async create(userId, dto) {
        const quantity = dto.quantity ?? 1;
        const isFoil = dto.isFoil ?? false;
        try {
            return await this.prisma.collectionEntry.upsert({
                where: {
                    userId_cardId_isFoil: { userId, cardId: dto.cardId, isFoil },
                },
                create: { userId, cardId: dto.cardId, quantity, isFoil },
                update: { quantity: { increment: quantity } },
                include: ENTRY_INCLUDE,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003') {
                throw new common_1.NotFoundException('Card not found');
            }
            throw error;
        }
    }
    async update(userId, id, dto) {
        await this.findOwnedOrFail(userId, id);
        try {
            return await this.prisma.collectionEntry.update({
                where: { id },
                data: dto,
                include: ENTRY_INCLUDE,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException('Collection entry not found');
            }
            throw error;
        }
    }
    async remove(userId, id) {
        await this.findOwnedOrFail(userId, id);
        try {
            await this.prisma.collectionEntry.delete({ where: { id } });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException('Collection entry not found');
            }
            throw error;
        }
    }
    async summary(userId) {
        const entries = await this.prisma.collectionEntry.findMany({
            where: { userId },
            include: { card: { include: { rarity: true } } },
        });
        let totalCards = 0;
        const byRarity = {};
        for (const entry of entries) {
            totalCards += entry.quantity;
            const rarityName = entry.card.rarity.name;
            byRarity[rarityName] = (byRarity[rarityName] ?? 0) + entry.quantity;
        }
        return {
            totalCards,
            uniqueCards: entries.length,
            byRarity,
        };
    }
    async findOwnedOrFail(userId, id) {
        const entry = await this.prisma.collectionEntry.findUnique({
            where: { id },
        });
        if (!entry || entry.userId !== userId) {
            throw new common_1.NotFoundException('Collection entry not found');
        }
        return entry;
    }
};
exports.CollectionsService = CollectionsService;
exports.CollectionsService = CollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollectionsService);
//# sourceMappingURL=collections.service.js.map