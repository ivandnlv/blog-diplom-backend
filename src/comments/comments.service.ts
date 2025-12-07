// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '@prisma/client';

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

  async findApprovedByPostId(postId: number): Promise<CommentEntity[]> {
    return this.prisma.comment.findMany({
      where: {
        postId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async createForPost(input: CreateCommentInput): Promise<CommentEntity> {
    return this.prisma.comment.create({
      data: {
        postId: input.postId,
        parentId: input.parentId ?? null,
        authorName: input.authorName,
        authorEmail: input.authorEmail ?? null,
        content: input.content,
        isApproved: false, // новый комментарий ждёт модерации
      },
    });
  }
}
