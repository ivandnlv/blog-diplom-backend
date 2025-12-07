// src/posts/admin-posts.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  BadRequestException,
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
  getAllPosts(): PostEntity[] {
    return this.postsService.findAll();
  }

  @Post()
  createPost(@Body() dto: CreatePostDto): PostEntity {
    const input: CreatePostInput = {
      title: dto.title,
      slug: dto.slug,
      content: dto.content,
      published: dto.published ?? false,
    };

    return this.postsService.createPost(input);
  }

  @Patch(':id')
  updatePost(
    @Param('id') idParam: string,
    @Body() dto: UpdatePostDto,
  ): PostEntity {
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
  deletePost(@Param('id') idParam: string): void {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid post id');
    }

    this.postsService.deletePost(id);
  }
}
