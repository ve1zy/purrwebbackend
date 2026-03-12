import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateColumnDto) {
    return this.prisma.column.create({
      data: {
        title: dto.title,
        position: dto.position ?? 0,
        userId,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.column.findUnique({ where: { id } });
  }

  async findUserColumns(userId: string) {
    return this.prisma.column.findMany({
      where: { userId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async update(userId: string, id: string, dto: UpdateColumnDto) {
    const column = await this.prisma.column.findUnique({ where: { id } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    if (column.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.column.update({
      where: { id },
      data: {
        title: dto.title,
        position: dto.position ?? column.position,
      },
    });
  }

  async remove(userId: string, id: string) {
    const column = await this.prisma.column.findUnique({ where: { id } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    if (column.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.column.delete({ where: { id } });
    return { id };
  }
}
