import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserDto } from './dto/user.dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private toDto(user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(dto: CreateUserDto & { password: string }): Promise<UserDto> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.toDto(user);
  }

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user ? this.toDto(user) : null;
  }

  async findByEmailForAuth(email: string): Promise<{
    id: string;
    email: string;
    password: string;
  } | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }
}
