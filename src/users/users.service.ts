import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateMeDto } from '../auth/dto/update-me.dto';

export interface CreateUserInput {
  email: string;
  password: string;
  username: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(input: CreateUserInput) {
    const exists = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(input.password, 10);

    return this.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        avatarUrl: input.avatarUrl,
        passwordHash,
        role: 'USER', // Prisma enum
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getMe(user: CurrentUser) {
    return this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
  }

  async updateMe(user: CurrentUser, dto: UpdateMeDto) {
    const data: {
      username?: string;
      avatarUrl?: string | null;
      passwordHash?: string;
    } = {};

    if (dto.username !== undefined) {
      data.username = dto.username;
    }

    if (dto.avatarUrl !== undefined) {
      // avatarUrl nullable в prisma
      data.avatarUrl = dto.avatarUrl;
    }

    if (dto.newPassword !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    }

    // если вообще нечего обновлять
    if (Object.keys(data).length === 0) {
      return this.getMe(user);
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data,
    });
  }
}
