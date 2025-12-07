// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

export interface PostEntity {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string; // ISO-строка, для простоты
  updatedAt: string;
}

@Injectable()
export class PostsService {
  // временное in-memory хранилище
  private posts: PostEntity[] = [
    {
      id: 1,
      title: 'Первый пост',
      slug: 'pervyj-post',
      content: 'Содержимое первого поста',
      published: true,
      createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
    },
    {
      id: 2,
      title: 'Черновик поста',
      slug: 'chernovik-posta',
      content: 'Этот пост пока не опубликован',
      published: false,
      createdAt: new Date('2025-01-02T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2025-01-02T00:00:00.000Z').toISOString(),
    },
  ];

  findAllPublished(): PostEntity[] {
    return this.posts.filter((post) => post.published);
  }

  findPublishedBySlug(slug: string): PostEntity {
    const post = this.posts.find((p) => p.slug === slug && p.published);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
