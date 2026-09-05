import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [PrismaModule, CardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
