import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService],
  imports: [PrismaModule],
  exports: [ColumnsService],
})
export class ColumnsModule {}
