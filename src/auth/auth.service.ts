import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from './jwt/jwt.service';
import { PasswordService } from './password/password.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto/auth-response.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly password: PasswordService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.users.findByEmailForAuth(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.password.hash(dto.password);
    let user;
    try {
      user = await this.users.create({
        email: dto.email,
        password: passwordHash,
        name: dto.name,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('Email already in use');
        }
      }
      throw e;
    }

    const accessToken = await this.jwt.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, userId: user.id, email: user.email };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.users.findByEmailForAuth(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await this.password.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwt.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, userId: user.id, email: user.email };
  }
}
