import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CommentsService,
  CommentEntity,
  CreateCommentInput,
} from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { PaginatedResult } from '../common/pagination/pagination.types';

@ApiTags('Comments')
@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /api/posts/:postId/comments?page=&limit=
  @Get(':postId/comments')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCommentsForPost(
    @Param('postId') postIdParam: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<CommentEntity>> {
    const postId = Number(postIdParam);
    if (Number.isNaN(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.commentsService.findApprovedByPostId(postId, page, limit);
  }

  // POST /api/posts/:postId/comments — создание, тут пагинация не нужна
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
