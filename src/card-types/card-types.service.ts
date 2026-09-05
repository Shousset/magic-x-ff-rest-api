import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardTypesService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.cardType.findMany({ orderBy: { name: 'asc' } });
    }
}