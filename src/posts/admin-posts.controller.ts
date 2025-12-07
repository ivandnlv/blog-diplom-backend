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
} from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('admin/posts')
@UseGuards(JwtAuthGuard)
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Post()
  async createPost(@Body() dto: CreatePostDto): Promise<PostEntity> {
    const input: CreatePostInput = {
      title: dto.title,
      slug: dto.slug,
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
      slug: dto.slug,
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
