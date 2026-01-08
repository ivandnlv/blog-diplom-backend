// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '@prisma/client';
import { PaginatedResult } from '../common/pagination/pagination.types';

export type CommentEntity = Comment;

export interface CreateCommentInput {
  postId: number;
  parentId?: number | null;
  authorName: string;
  authorEmail?: string | null;
  content: string;
}

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findApprovedByPostId(
    postId: number,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<CommentEntity>> {
    if (limit === 0) {
      const items = await this.prisma.comment.findMany({
        where: {
          postId,
          isApproved: true,
        },
        orderBy: { createdAt: 'asc' },
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
      this.prisma.comment.findMany({
        where: {
          postId,
          isApproved: true,
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({
        where: {
          postId,
          isApproved: true,
        },
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

  async createForPost(input: CreateCommentInput): Promise<CommentEntity> {
    return this.prisma.comment.create({
      data: {
        postId: input.postId,
        parentId: input.parentId ?? null,
        authorName: input.authorName,
        authorEmail: input.authorEmail ?? null,
        content: input.content,
        isApproved: true,
      },
    });
  }

  // в CommentsService, под публичными методами

  async findAll(): Promise<CommentEntity[]> {
    return this.prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllPaginated(
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<CommentEntity>> {
    if (limit === 0) {
      const items = await this.prisma.comment.findMany({
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
      this.prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count(),
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

  async approveComment(id: number): Promise<CommentEntity> {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: {
          isApproved: true,
        },
      });
    } catch (_e) {
      throw new Error('Comment not found');
    }
  }

  async deleteComment(id: number): Promise<void> {
    try {
      await this.prisma.comment.delete({
        where: { id },
      });
    } catch (_e) {
      throw new Error('Comment not found');
    }
  }
}
