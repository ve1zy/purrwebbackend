import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator/current-user.decorator';
import { CreateColumnDto } from './dto/create-column.dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto/update-column.dto';
import { ColumnsService } from './columns.service';

@ApiTags('columns')
@ApiBearerAuth('access-token')
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columns: ColumnsService) {}

  @ApiOperation({ summary: 'Create column (current user)' })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateColumnDto) {
    return this.columns.create(user.userId, dto);
  }

  @ApiOperation({ summary: 'Get my columns' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async my(@CurrentUser() user: AuthUser) {
    return this.columns.findUserColumns(user.userId);
  }

  @ApiOperation({ summary: 'Get column by id' })
  @ApiResponse({ status: 200 })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.columns.findById(id);
  }

  @ApiOperation({ summary: 'Update column (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columns.update(user.userId, id, dto);
  }

  @ApiOperation({ summary: 'Delete column (owner only)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.columns.remove(user.userId, id);
  }
}
