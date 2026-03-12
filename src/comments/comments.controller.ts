import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto/update-comment.dto';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@ApiBearerAuth('access-token')
@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @ApiOperation({ summary: 'Create comment for card (owner only)' })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Post('/cards/:cardId')
  async create(
    @CurrentUser() user: AuthUser,
    @Param('cardId') cardId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.comments.create(user.userId, cardId, dto);
  }

  @ApiOperation({ summary: 'Get comments for card (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/cards/:cardId')
  async list(@CurrentUser() user: AuthUser, @Param('cardId') cardId: string) {
    return this.comments.listForCard(user.userId, cardId);
  }

  @ApiOperation({ summary: 'Update comment (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.comments.update(user.userId, id, dto);
  }

  @ApiOperation({ summary: 'Delete comment (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.comments.remove(user.userId, id);
  }
}
