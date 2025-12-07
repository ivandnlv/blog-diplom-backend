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

@ApiTags('Admin / Comments')
@ApiBearerAuth()
@Controller('admin/comments')
@UseGuards(JwtAuthGuard)
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

  // PATCH /admin/comments/:id/approve — одобрение комментария
  @Patch(':id/approve')
  async approveComment(@Param('id') idParam: string): Promise<CommentEntity> {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid comment id');
    }

    return this.commentsService.approveComment(id);
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
