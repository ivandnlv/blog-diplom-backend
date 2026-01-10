// src/posts/dto/post-list-item-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PostListItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  thumbnailUrl?: string;

  @ApiProperty()
  contentImagesUrls?: string[];
}
