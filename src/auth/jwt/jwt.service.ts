import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload/jwt-payload';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  async signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload);
  }
}
