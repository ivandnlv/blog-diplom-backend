// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';

export interface CommentEntity {
  id: number;
  postId: number;
  parentId: number | null;
  authorName: string;
  authorEmail: string | null;
  content: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  postId: number;
  parentId?: number | null;
  authorName: string;
  authorEmail?: string | null;
  content: string;
}

@Injectable()
export class CommentsService {
  // Временное in-memory хранилище
  private comments: CommentEntity[] = [
    {
      id: 1,
      postId: 1,
      parentId: null,
      authorName: 'Первый комментатор',
      authorEmail: 'user@example.com',
      content: 'Отличный пост!',
      isApproved: true,
      createdAt: new Date('2025-01-01T12:00:00.000Z').toISOString(),
      updatedAt: new Date('2025-01-01T12:00:00.000Z').toISOString(),
    },
  ];

  findApprovedByPostId(postId: number): CommentEntity[] {
    return this.comments.filter((c) => c.postId === postId && c.isApproved);
  }

  createForPost(input: CreateCommentInput): CommentEntity {
    const now = new Date().toISOString();

    const newId =
      this.comments.length === 0
        ? 1
        : Math.max(...this.comments.map((c) => c.id)) + 1;

    const comment: CommentEntity = {
      id: newId,
      postId: input.postId,
      parentId: input.parentId ?? null,
      authorName: input.authorName,
      authorEmail: input.authorEmail ?? null,
      content: input.content,
      isApproved: false, // по ТЗ: новый комментарий ждёт модерации
      createdAt: now,
      updatedAt: now,
    };

    this.comments.push(comment);

    return comment;
  }
}
