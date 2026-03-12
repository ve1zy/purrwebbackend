import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PasswordService } from '../auth/password/password.service';
import { ColumnsModule } from '../columns/columns.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
  imports: [PrismaModule, ColumnsModule],
  exports: [UsersService],
})
export class UsersModule {}
