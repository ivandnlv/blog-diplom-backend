import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateMeDto } from './dto/update-me.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { Prisma } from '@prisma/client';

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

  async findAllPaginated(page = 1, limit = 20) {
    if (limit === 0) {
      const items = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        items,
        total: items.length,
        page: 1,
        limit: 0,
        totalPages: 1,
      };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          role: 'USER',
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async adminUpdateUser(id: number, dto: AdminUpdateUserDto) {
    try {
      const data: {
        email?: string;
        username?: string;
        avatarUrl?: string | null;
        passwordHash?: string;
      } = {};

      if (dto.email !== undefined) data.email = dto.email;
      if (dto.username !== undefined) data.username = dto.username;

      if (dto.avatarUrl !== undefined) {
        data.avatarUrl = dto.avatarUrl;
      }

      if (dto.newPassword !== undefined) {
        data.passwordHash = await bcrypt.hash(dto.newPassword, 10);
      }
      if (Object.keys(data).length === 0) {
        return this.prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      }

      return this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }

      throw e;
    }
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
