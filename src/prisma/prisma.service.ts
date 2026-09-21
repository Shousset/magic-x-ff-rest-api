import 'dotenv/config';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('✅ Conexión exitosa a la base de datos PostgreSQL.');
    } catch (error) {
      this.logger.warn(
        '⚠️ No se pudo conectar a la base de datos PostgreSQL en este momento. ' +
          'Asegúrate de configurar la variable DATABASE_URL en el archivo .env con las credenciales de tu base de datos y que PostgreSQL esté corriendo.',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
