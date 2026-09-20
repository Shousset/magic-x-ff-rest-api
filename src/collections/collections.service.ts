import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionEntryDto } from './dto/create-collection-entry.dto';
import { UpdateCollectionEntryDto } from './dto/update-collection-entry.dto';

const ENTRY_INCLUDE = {
  card: { include: { rarity: true, cardType: true } },
} as const;

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.collectionEntry.findMany({
      where: { userId },
      include: ENTRY_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateCollectionEntryDto) {
    const quantity = dto.quantity ?? 1;
    const isFoil = dto.isFoil ?? false;

    try {
      // Si el usuario ya tiene esa carta+versión, sumamos cantidad en vez
      // de duplicar la fila (no lanzamos 409 por una unicidad esperada).
      return await this.prisma.collectionEntry.upsert({
        where: {
          userId_cardId_isFoil: { userId, cardId: dto.cardId, isFoil },
        },
        create: { userId, cardId: dto.cardId, quantity, isFoil },
        update: { quantity: { increment: quantity } },
        include: ENTRY_INCLUDE,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        // cardId no existe: violación de la clave foránea hacia Card.
        throw new NotFoundException('Card not found');
      }
      throw error;
    }
  }

  async update(userId: string, id: string, dto: UpdateCollectionEntryDto) {
    await this.findOwnedOrFail(userId, id);

    try {
      return await this.prisma.collectionEntry.update({
        where: { id },
        data: dto,
        include: ENTRY_INCLUDE,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Collection entry not found');
      }
      throw error;
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOwnedOrFail(userId, id);

    try {
      await this.prisma.collectionEntry.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Collection entry not found');
      }
      throw error;
    }
  }

  async summary(userId: string) {
    const entries = await this.prisma.collectionEntry.findMany({
      where: { userId },
      include: { card: { include: { rarity: true } } },
    });

    let totalCards = 0;
    const byRarity: Record<string, number> = {};

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

  /**
   * Busca la entrada y confirma que sea del usuario autenticado. Si existe
   * pero es de otro usuario, devolvemos 404 igual que si no existiera:
   * no revelamos que la fila está ahí pero pertenece a otra cuenta.
   */
  private async findOwnedOrFail(userId: string, id: string) {
    const entry = await this.prisma.collectionEntry.findUnique({
      where: { id },
    });

    if (!entry || entry.userId !== userId) {
      throw new NotFoundException('Collection entry not found');
    }

    return entry;
  }
}
