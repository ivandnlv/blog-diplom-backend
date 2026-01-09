import { ApiProperty } from '@nestjs/swagger';

export class CommentListItemDto {
  @ApiProperty() id: number;
  @ApiProperty() postId: number;
  @ApiProperty({ nullable: true }) parentId: number | null;

  @ApiProperty() authorName: string;
  @ApiProperty({ nullable: true, required: false }) authorEmail?: string | null;
  @ApiProperty() content: string;

  @ApiProperty() isApproved: boolean;

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  @ApiProperty({
    example: 3,
    description: 'Количество прямых вложенных комментариев (children)',
  })
  childrenCount: number;
}
