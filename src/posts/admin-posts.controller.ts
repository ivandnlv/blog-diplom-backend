// src/posts/admin-posts.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PostsService,
  PostEntity,
  CreatePostInput,
  UpdatePostInput,
  PostListItemEntity,
} from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaginatedResult } from '../common/pagination/pagination.types';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { ApiOkResponseEnvelope } from '../common/http/swagger-helpers';
import { PostListItemResponseDto } from './dto/post-list-item-response.dto';

@ApiTags('Admin / Posts')
@ApiBearerAuth()
@Controller('admin/posts')
@UseGuards(JwtAuthGuard)
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponseEnvelope(PostListItemResponseDto, { isPaginated: true })
  async getAllPosts(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<PostListItemEntity>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.postsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOkResponseEnvelope(PostResponseDto)
  async getPostById(@Param('id') idParam: string): Promise<PostEntity> {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid post id');
    }

    return this.postsService.getPostDetailsById(id);
  }

  @Post()
  @ApiOkResponseEnvelope(PostResponseDto)
  async createPost(@Body() dto: CreatePostDto): Promise<PostEntity> {
    const input: CreatePostInput = {
      title: dto.title,
      content: dto.content,
      published: dto.published ?? false,
    };

    return this.postsService.createPost(input);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') idParam: string,
    @Body() dto: UpdatePostDto,
  ): Promise<PostEntity> {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid post id');
    }

    const input: UpdatePostInput = {
      title: dto.title,
      content: dto.content,
      published: dto.published,
    };

    return this.postsService.updatePost(id, input);
  }

  @Delete(':id')
  async deletePost(@Param('id') idParam: string): Promise<void> {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid post id');
    }

    await this.postsService.deletePost(id);
  }
}
