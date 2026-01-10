import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginatedResult } from '../common/pagination/pagination.types';
import { ApiOkResponseEnvelope } from '../common/http/swagger-helpers';
import { CommentResponseDto } from './dto/comment-response.dto';
import { GetPostCommentsQueryDto } from './dto/get-post-comments.query.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Comments')
@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /api/posts/:postId/comments?page=&limit=
  @Get(':postId/comments')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponseEnvelope(CommentResponseDto, { isPaginated: true })
  async getCommentsForPost(
    @Param('postId') postIdParam: string,
    @Query() query: GetPostCommentsQueryDto,
  ): Promise<PaginatedResult<CommentResponseDto>> {
    const postId = Number(postIdParam);
    if (Number.isNaN(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const parentId = query?.parentId;

    return this.commentsService.getForPost({
      postId,
      page,
      limit,
      parentId,
    });
  }

  // POST /api/posts/:postId/comments — создание, тут пагинация не нужна
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postIdParam: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: CurrentUser,
  ) {
    const postId = Number(postIdParam);
    if (Number.isNaN(postId)) throw new BadRequestException('Invalid post id');

    return this.commentsService.createForPost({
      postId,
      parentId: dto.parentId ?? null,
      content: dto.content,
      authorId: user.id,
    });
  }
}
