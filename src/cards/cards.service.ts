import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, columnId: string, dto: CreateCardDto) {
    const column = await this.prisma.column.findUnique({ where: { id: columnId } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    if (column.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.card.create({
      data: {
        title: dto.title,
        description: dto.description,
        position: dto.position ?? 0,
        columnId,
      },
    });
  }

  async findByIdForUser(userId: string, id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { column: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.column.userId !== userId) {
      throw new ForbiddenException();
    }

    return card;
  }

  async findColumnCardsForUser(userId: string, columnId: string) {
    const column = await this.prisma.column.findUnique({ where: { id: columnId } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    if (column.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.card.findMany({
      where: { columnId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async update(userId: string, id: string, dto: UpdateCardDto) {
    const existing = await this.prisma.card.findUnique({
      where: { id },
      include: { column: true },
    });

    if (!existing) {
      throw new NotFoundException('Card not found');
    }
    if (existing.column.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.card.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        position: dto.position ?? existing.position,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findByIdForUser(userId, id);
    await this.prisma.card.delete({ where: { id } });
    return { id };
  }
}
