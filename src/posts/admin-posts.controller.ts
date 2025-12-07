// src/posts/admin-posts.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService, PostEntity, CreatePostInput } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('admin/posts')
@UseGuards(JwtAuthGuard)
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET /admin/posts — все посты, включая неопубликованные
  @Get()
  getAllPosts(): PostEntity[] {
    return this.postsService.findAll();
  }

  // POST /admin/posts — создать новый пост
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
}
