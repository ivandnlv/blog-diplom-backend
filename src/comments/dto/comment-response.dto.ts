// src/posts/dto/post-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class CommentAuthorDto {
  @ApiProperty() id: number;
  @ApiProperty() email: string;
}

export class CommentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty({ nullable: true })
  parentId: number;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  authorEmail: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ nullable: true })
  moderationReason: string;

  @ApiProperty({ type: CommentAuthorDto })
  author: CommentAuthorDto;

  @ApiProperty({
    example: 3,
    description: 'Количество прямых дочерних комментариев (parentId = id)',
  })
  childrenCount: number;
}
