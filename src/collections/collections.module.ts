import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
