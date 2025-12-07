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

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  published: boolean;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  published?: boolean;
}

@Injectable()
export class PostsService {
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

  // Публичные методы уже есть...

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

  // ↓↓↓ Админские методы ↓↓↓

  findAll(): PostEntity[] {
    return this.posts;
  }

  createPost(input: CreatePostInput): PostEntity {
    const now = new Date().toISOString();

    const newId =
      this.posts.length === 0
        ? 1
        : Math.max(...this.posts.map((p) => p.id)) + 1;

    const newPost: PostEntity = {
      id: newId,
      title: input.title,
      slug: input.slug,
      content: input.content,
      published: input.published,
      createdAt: now,
      updatedAt: now,
    };

    this.posts.push(newPost);

    return newPost;
  }

  updatePost(id: number, input: UpdatePostInput): PostEntity {
    const postIndex = this.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }

    const existing = this.posts[postIndex];
    const now = new Date().toISOString();

    const updated: PostEntity = {
      ...existing,
      ...input,
      updatedAt: now,
    };

    this.posts[postIndex] = updated;

    return updated;
  }

  deletePost(id: number): void {
    const postIndex = this.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      throw new NotFoundException('Post not found');
    }

    this.posts.splice(postIndex, 1);
  }
}
