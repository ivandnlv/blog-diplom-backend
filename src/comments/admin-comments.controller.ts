import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService, CommentEntity } from './comments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaginatedResult } from '../common/pagination/pagination.types';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { ApiOkResponseEnvelope } from '../common/http/swagger-helpers';
import { CommentResponseDto } from './dto/comment-response.dto';
import { Body } from '@nestjs/common';
import { ModerateCommentDto } from './dto/moderate-comment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Admin / Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/comments')
export class AdminCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponseEnvelope(CommentResponseDto, { isPaginated: true })
  async getAllComments(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<CommentEntity>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.commentsService.findAllPaginated(page, limit);
  }

  // PATCH /admin/comments/:id/moderate — модерация комментария
  @Patch(':id/moderate')
  async moderate(
    @Param('id') idParam: string,
    @Body() dto: ModerateCommentDto,
  ): Promise<CommentEntity> {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid comment id');
    }

    return this.commentsService.moderateComment(id, {
      isApproved: dto.isApproved,
      moderationReason: dto.moderationReason,
    });
  }

  // DELETE /admin/comments/:id — удалить комментарий
  @Delete(':id')
  async deleteComment(@Param('id') idParam: string): Promise<void> {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid comment id');
    }

    await this.commentsService.deleteComment(id);
  }
}
