import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, cardId: string, dto: CreateCommentDto) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: { column: true },
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.column.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        cardId,
      },
    });
  }

  async listForCard(userId: string, cardId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: { column: true },
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.column.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.comment.findMany({
      where: { cardId },
      orderBy: [{ createdAt: 'asc' }],
    });
  }

  async update(userId: string, id: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { card: { include: { column: true } } },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.card.column.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
    });
  }

  async remove(userId: string, id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { card: { include: { column: true } } },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.card.column.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.comment.delete({ where: { id } });
    return { id };
  }
}
