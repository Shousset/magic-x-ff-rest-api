import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RaritiesService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.rarity.findMany({ orderBy: { name: 'asc' } });
    }
}