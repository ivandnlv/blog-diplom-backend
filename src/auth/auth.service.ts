// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserInput, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  // опционально, пригодится позже для регистрации/смены пароля
  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plain, saltRounds);
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isValid = await this.comparePassword(password, user.passwordHash);

    if (!isValid) {
      return null;
    }

    return user;
  }

  private async signToken(id: number, email: string, role: string) {
    return this.jwtService.signAsync({ sub: id, email, role });
  }

  async register(input: CreateUserInput) {
    const user = await this.usersService.createUser(input);
    const accessToken = await this.signToken(user.id, user.email, user.role);
    return { user, accessToken };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.signToken(user.id, user.email, user.role);
    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
    };
  }
}
