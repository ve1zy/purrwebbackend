import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from './jwt/jwt.module';
import { PasswordService } from './password/password.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  imports: [JwtModule, UsersModule, PrismaModule],
})
export class AuthModule {}
