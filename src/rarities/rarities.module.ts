import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RaritiesController } from './rarities.controller';
import { RaritiesService } from './rarities.service';

@Module({
  imports: [PrismaModule],
  controllers: [RaritiesController],
  providers: [RaritiesService],
})
export class RaritiesModule {}
