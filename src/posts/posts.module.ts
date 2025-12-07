// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AdminPostsController } from './admin-posts.controller';

@Module({
  controllers: [PostsController, AdminPostsController],
  providers: [PostsService],
})
export class PostsModule {}
