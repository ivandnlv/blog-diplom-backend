// src/posts/posts.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { PaginatedResult } from '../common/pagination/pagination.types';

export type PostEntity = Post;

export interface CreatePostInput {
  title: string;
  content: string;
  published: boolean;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private slugifyTitle(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        // пробелы и подчёркивания -> дефис
        .replace(/[\s_]+/g, '-')
        // убираем всё, кроме латиницы, цифр и дефисов
        .replace(/[^a-z0-9-]/g, '')
        // несколько дефисов подряд -> один
        .replace(/-+/g, '-')
        // убрать дефисы в начале/конце
        .replace(/^-|-$/g, '') || 'post'
    );
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = this.slugifyTitle(title);
    let slug = baseSlug;
    let counter = 1;

    // простой цикл: пока есть такой slug — добавляем -1, -2 и т.д.
    // да, это доп. запросы к БД, но для диплома и маленького проекта это норм.
    // В редких гонках всё равно сможет выстрелить P2002, и это ок — у нас уже есть обработчик.
    // (можно будет потом усложнить, если захочешь)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.prisma.post.findUnique({
        where: { slug },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter++}`;
    }
  }

  // --- публичные методы ---

  async findAllPublished(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<PostEntity>> {
    if (limit === 0) {
      const items = await this.prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      });
      const total = items.length;

      return {
        items,
        total,
        page: 1,
        limit: 0,
        totalPages: 1,
      };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({
        where: { published: true },
      }),
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

  async findPublishedBySlug(slug: string): Promise<PostEntity> {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        published: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  // --- админские методы ---

  async findAll(page = 1, limit = 10): Promise<PaginatedResult<PostEntity>> {
    if (limit === 0) {
      const items = await this.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
      });
      const total = items.length;

      return {
        items,
        total,
        page: 1,
        limit: 0,
        totalPages: 1,
      };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count(),
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

  async createPost(input: CreatePostInput): Promise<PostEntity> {
    const slug = await this.generateUniqueSlug(input.title);

    try {
      return await this.prisma.post.create({
        data: {
          title: input.title,
          slug,
          content: input.content,
          published: input.published,
        },
      });
    } catch (error) {
      // На всякий случай оставляем P2002, как сетку безопасности
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Slug is already in use');
      }

      throw error;
    }
  }

  async updatePost(id: number, input: UpdatePostInput): Promise<PostEntity> {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          // Prisma сам обновит updatedAt за счёт @updatedAt
          ...input,
        },
      });
    } catch (_e) {
      // Честно: здесь мы не различаем типы ошибок Prisma.
      // Любая ошибка при update сейчас маппится в 404.
      throw new NotFoundException('Post not found');
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
    } catch (_e) {
      // То же самое: любую ошибку удаления считаем "не найден".
      throw new NotFoundException('Post not found');
    }
  }
}
