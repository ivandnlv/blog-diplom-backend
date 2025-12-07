// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private validateAdminCredentials(email: string, password: string): boolean {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      return false;
    }

    return email === adminEmail && password === adminPassword;
  }

  login(email: string, password: string): { accessToken: string } {
    const isValid = this.validateAdminCredentials(email, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // payload токена — минимальный, без лишнего
    const payload = {
      sub: 'admin', // subject — можем использовать строку, так как админ один
      email,
      role: 'admin',
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
