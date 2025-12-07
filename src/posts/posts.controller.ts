// src/posts/posts.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { PostsService, PostEntity } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET /posts — список опубликованных постов
  @Get()
  getPublishedPosts(): PostEntity[] {
    return this.postsService.findAllPublished();
  }

  // GET /posts/:slug — один опубликованный пост по slug
  @Get(':slug')
  getPostBySlug(@Param('slug') slug: string): PostEntity {
    return this.postsService.findPublishedBySlug(slug);
  }
}
