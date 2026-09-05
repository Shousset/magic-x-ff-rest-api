import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not configured');
        }

        const databaseUrl = new URL(process.env.DATABASE_URL);
        const schema = databaseUrl.searchParams.get('schema') ?? 'public';
        databaseUrl.searchParams.delete('sslmode');
        databaseUrl.searchParams.delete('schema');

        const adapter = new PrismaPg({
            connectionString: databaseUrl.toString(),
            ssl: { rejectUnauthorized: false },
        }, { schema });

        super({ adapter });
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }
}