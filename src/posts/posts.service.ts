// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';

export type PostEntity = Post;

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  published: boolean;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  published?: boolean;
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // --- публичные методы ---

  async findAllPublished(): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
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

  async findAll(): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPost(input: CreatePostInput): Promise<PostEntity> {
    return this.prisma.post.create({
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        published: input.published,
      },
    });
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
    } catch (e) {
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
    } catch (e) {
      // То же самое: любую ошибку удаления считаем "не найден".
      throw new NotFoundException('Post not found');
    }
  }
}
