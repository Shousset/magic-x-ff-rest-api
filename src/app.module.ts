import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { PrismaModule } from './prisma/prisma.module';
import { CardTypesModule } from './card-types/card-types.module';
import { RaritiesModule } from './rarities/rarities.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, CardsModule, RaritiesModule, CardTypesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
