// src/comments/comments.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '@prisma/client';
import { PaginatedResult } from '../common/pagination/pagination.types';
import { CommentResponseDto } from './dto/comment-response.dto';

export type CommentEntity = Comment;

export interface CreateCommentInput {
  postId: number;
  parentId?: number | null;
  content: string;
  authorId: number;
}

export interface ModerateCommentInput {
  isApproved: boolean;
  moderationReason?: string;
}

export interface GetPostCommentsInput {
  postId: number;
  page?: number;
  limit?: number;
  parentId?: number;
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
    const parentId: number | null = input?.parentId ?? null;

    // 1) Ограничение глубины (как у тебя уже есть)
    if (parentId) {
      const parent = await this.prisma.comment.findFirst({
        where: { id: parentId, postId: input.postId },
        select: { id: true, parentId: true },
      });

      if (!parent) throw new NotFoundException('Parent comment not found');

      if (parent.parentId) {
        const parentParent = await this.prisma.comment.findUnique({
          where: { id: parent.parentId },
          select: { parentId: true },
        });

        if (parentParent?.parentId) {
          throw new BadRequestException(
            'Comments nesting depth is limited to 2 levels',
          );
        }
      }
    }

    // 2) Теперь комментарий создаёт только авторизованный пользователь
    return this.prisma.comment.create({
      data: {
        postId: input.postId,
        parentId,
        content: input.content,

        authorId: input.authorId,
        isApproved: true,
        moderationReason: null,
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
    postId?: number,
  ): Promise<PaginatedResult<CommentEntity>> {
    const where = postId !== undefined ? { postId } : undefined;

    if (limit === 0) {
      const items = await this.prisma.comment.findMany({
        where,
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
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({ where }),
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

  async moderateComment(
    id: number,
    input: ModerateCommentInput,
  ): Promise<CommentEntity> {
    // Доп. защита на уровне сервиса (помимо DTO)
    if (
      input.isApproved === false &&
      (!input.moderationReason || input.moderationReason.trim().length === 0)
    ) {
      // можно кинуть BadRequestException, но чаще это ловится DTO
      throw new Error('moderationReason is required when isApproved is false');
    }

    try {
      return await this.prisma.comment.update({
        where: { id },
        data: {
          isApproved: input.isApproved,
          moderationReason: input.isApproved
            ? null
            : input.moderationReason!.trim(),
        },
      });
    } catch (_e) {
      throw new NotFoundException('Comment not found');
    }
  }

  async deleteComment(id: number): Promise<void> {
    try {
      await this.prisma.comment.delete({
        where: { id },
      });
    } catch (_e) {
      throw new NotFoundException('Comment not found');
    }
  }

  async getForPost(input: {
    postId: number;
    page: number;
    limit: number;
    parentId?: number;
  }): Promise<PaginatedResult<CommentResponseDto>> {
    const { postId, page, limit } = input;
    const parentId = input.parentId ?? null;

    // Если указан parentId — валидируем, что родитель существует и относится к этому же посту
    if (input.parentId) {
      const parent = await this.prisma.comment.findFirst({
        where: { id: input.parentId, postId },
        select: { id: true, parentId: true },
      });

      if (!parent) throw new NotFoundException('Parent comment not found');

      // Ограничение глубины выдачи (строго)
      if (parent.parentId) {
        const parentParent = await this.prisma.comment.findUnique({
          where: { id: parent.parentId },
          select: { parentId: true },
        });

        if (parentParent?.parentId) {
          throw new BadRequestException(
            'Comments nesting depth is limited to 2 levels',
          );
        }
      }
    }

    const whereBase = {
      postId,
      isApproved: true,
    };

    const where = parentId
      ? { ...whereBase, parentId }
      : { ...whereBase, parentId: null };

    const total = await this.prisma.comment.count({ where });

    const queryArgs: any = {
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { children: true } },
        author: { select: { id: true, email: true } },
      },
    };

    if (limit !== 0) {
      queryArgs.skip = (page - 1) * limit;
      queryArgs.take = limit;
    }

    const rows = await this.prisma.comment.findMany(queryArgs);

    const items: CommentResponseDto[] = rows.map((c: any) => {
      const { _count, ...rest } = c;
      return {
        ...rest,
        childrenCount: _count?.children ?? 0,
      };
    });

    return {
      items,
      page,
      limit,
      total,
    } as PaginatedResult<CommentResponseDto>;
  }
}
