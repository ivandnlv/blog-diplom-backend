import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { PostsService, PostListItemEntity, PostEntity } from './posts.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { PaginatedResult } from '../common/pagination/pagination.types';
import { ApiOkResponseEnvelope } from '../common/http/swagger-helpers';
import { PostResponseDto } from './dto/post-response.dto';
import { PostListItemResponseDto } from './dto/post-list-item-response.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponseEnvelope(PostListItemResponseDto, { isPaginated: true })
  async getPublishedPosts(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<PostListItemEntity>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.postsService.findAllPublished(page, limit);
  }

  @Get(':slug')
  @ApiOkResponseEnvelope(PostResponseDto)
  async getPostBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return this.postsService.getPublishedPostDetailsBySlug(slug);
  }
}
