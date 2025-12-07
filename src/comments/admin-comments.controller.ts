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

@Controller('admin/comments')
@UseGuards(JwtAuthGuard)
export class AdminCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /admin/comments — все комментарии (одобренные и нет)
  @Get()
  async getAllComments(): Promise<CommentEntity[]> {
    return this.commentsService.findAll();
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
