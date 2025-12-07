import { IsEmail, IsOptional, IsString, Length, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Гость',
    description: 'Имя автора комментария',
  })
  @IsString()
  @Length(1, 100)
  authorName: string;

  @ApiPropertyOptional({
    example: 'guest@example.com',
    description: 'Email автора комментария (опционально)',
  })
  @IsOptional()
  @IsEmail()
  authorEmail?: string;

  @ApiProperty({
    example: 'Очень полезный пост!',
    description: 'Текст комментария',
  })
  @IsString()
  @Length(1, 2000)
  content: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID родительского комментария для вложенных комментариев',
  })
  @IsOptional()
  @IsInt()
  parentId?: number | null;
}
