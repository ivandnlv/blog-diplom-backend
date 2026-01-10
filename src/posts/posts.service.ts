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

// Минифицированная сущность для списков (без content)
export type PostListItemEntity = Pick<
  Post,
  'id' | 'title' | 'slug' | 'published' | 'createdAt' | 'updatedAt'
>;

export interface CreatePostInput {
  title: string;
  content: string;
  published: boolean;
  thumbnailUrl?: string;
  contentImagesUrls?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
  thumbnailUrl?: string;
  contentImagesUrls?: string[];
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private slugifyTitle(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'post'
    );
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = this.slugifyTitle(title);
    let slug = baseSlug;
    let counter = 1;

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

  // Список опубликованных: возвращаем минифицированные посты (без content)
  async findAllPublished(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<PostListItemEntity>> {
    if (limit === 0) {
      const items = await this.prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          published: true,
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
      this.prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          contentImagesUrls: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.post.count({
        where: { published: true },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Детальная инфа по опубликованному посту: возвращаем полный пост (с content)
  async getPublishedPostDetailsBySlug(slug: string): Promise<PostEntity> {
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

  // Список всех постов (админ): тоже минифицированный (без content)
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<PostListItemEntity>> {
    if (limit === 0) {
      const items = await this.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          contentImagesUrls: true,
          published: true,
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
      this.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          contentImagesUrls: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
          thumbnailUrl: input.thumbnailUrl,
          contentImagesUrls: input.contentImagesUrls,
        },
      });
    } catch (error) {
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
          ...input,
        },
      });
    } catch (_e) {
      throw new NotFoundException('Post not found');
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
    } catch (_e) {
      throw new NotFoundException('Post not found');
    }
  }

  async getPostDetailsById(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
