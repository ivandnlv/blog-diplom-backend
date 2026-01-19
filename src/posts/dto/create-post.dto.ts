import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'Добро пожаловать в блог',
    description: 'Заголовок поста',
  })
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    example: 'Это первый пост в нашем мини-блоге...',
    description: 'Основной контент поста',
  })
  @IsString()
  @Length(1, 5000)
  content: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Опубликован ли пост. По умолчанию false',
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  contentImagesUrls?: string[];
}
