// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      // честно: без строки подключения дальше работать нельзя
      throw new Error('DATABASE_URL is not set in environment variables');
    }

    const adapter = new PrismaPg({
      connectionString,
    });

    // В Prisma 7 нужно передавать adapter в конструктор PrismaClient
    // Иначе будет ошибка вида "Using engine type 'client' requires either 'adapter' or 'accelerateUrl'..."
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
