import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator/current-user.decorator';
import { CreateCardDto } from './dto/create-card.dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto/update-card.dto';
import { CardsService } from './cards.service';

@ApiTags('cards')
@ApiBearerAuth('access-token')
@Controller('cards')
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @ApiOperation({ summary: 'Create card in column (owner only)' })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Post('/columns/:columnId')
  async create(
    @CurrentUser() user: AuthUser,
    @Param('columnId') columnId: string,
    @Body() dto: CreateCardDto,
  ) {
    return this.cards.create(user.userId, columnId, dto);
  }

  @ApiOperation({ summary: 'Get cards of a column (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/columns/:columnId')
  async list(
    @CurrentUser() user: AuthUser,
    @Param('columnId') columnId: string,
  ) {
    return this.cards.findColumnCardsForUser(user.userId, columnId);
  }

  @ApiOperation({ summary: 'Get card by id (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.cards.findByIdForUser(user.userId, id);
  }

  @ApiOperation({ summary: 'Update card (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cards.update(user.userId, id, dto);
  }

  @ApiOperation({ summary: 'Delete card (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.cards.remove(user.userId, id);
  }
}
