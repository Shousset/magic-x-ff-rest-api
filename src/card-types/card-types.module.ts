import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CardTypesController } from './card-types.controller';
import { CardTypesService } from './card-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [CardTypesController],
  providers: [CardTypesService],
})
export class CardTypesModule {}
