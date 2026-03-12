import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ColumnsModule } from '../columns/columns.module';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [PrismaModule, ColumnsModule],
  exports: [CardsService],
})
export class CardsModule {}
