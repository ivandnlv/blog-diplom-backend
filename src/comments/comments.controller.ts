// src/comments/comments.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  CommentsService,
  CommentEntity,
  CreateCommentInput,
} from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /posts/:postId/comments
  @Get(':postId/comments')
  async getCommentsForPost(
    @Param('postId') postIdParam: string,
  ): Promise<CommentEntity[]> {
    const postId = Number(postIdParam);
    if (Number.isNaN(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    return this.commentsService.findApprovedByPostId(postId);
  }

  // POST /posts/:postId/comments
  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId') postIdParam: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const postId = Number(postIdParam);
    if (Number.isNaN(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const input: CreateCommentInput = {
      postId,
      parentId: dto.parentId,
      authorName: dto.authorName,
      authorEmail: dto.authorEmail,
      content: dto.content,
    };

    return this.commentsService.createForPost(input);
  }
}
