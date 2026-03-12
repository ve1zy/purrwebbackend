import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [PrismaModule, CardsModule],
  exports: [CommentsService],
})
export class CommentsModule {}
