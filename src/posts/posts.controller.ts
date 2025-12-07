import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsService, PostEntity } from './posts.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { PaginatedResult } from '../common/pagination/pagination.types';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET /api/posts?page=&limit=
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPublishedPosts(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<PostEntity>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.postsService.findAllPublished(page, limit);
  }

  // GET /api/posts/:slug — детальный, можно оставить без пагинации
  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return this.postsService.findPublishedBySlug(slug);
  }
}
