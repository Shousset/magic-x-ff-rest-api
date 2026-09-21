import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { CardTypesModule } from './card-types/card-types.module';
import { RaritiesModule } from './rarities/rarities.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { AppController } from './app.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CardsModule,
    RaritiesModule,
    CardTypesModule,
    UsersModule,
    AuthModule,
    CollectionsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}