import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserDto } from './dto/user.dto/user.dto';
import { UsersService } from './users.service';
import { PasswordService } from '../auth/password/password.service';
import { ColumnsService } from '../columns/columns.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly password: PasswordService,
    private readonly columns: ColumnsService,
  ) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: UserDto })
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    const hash = await this.password.hash(dto.password);
    return this.users.create({ ...dto, password: hash });
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: UserDto })
  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiOperation({ summary: 'Get columns of user by userId' })
  @ApiResponse({ status: 200 })
  @Get(':id/columns')
  async getUserColumns(@Param('id') id: string) {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.columns.findUserColumns(id);
  }
}
