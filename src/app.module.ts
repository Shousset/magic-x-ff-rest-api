import { Module, forwardRef } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CardTypesModule } from './card-types/card-types.module';
import { RaritiesModule } from './rarities/rarities.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    CardsModule,
    RaritiesModule,
    CardTypesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => CollectionsModule),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
