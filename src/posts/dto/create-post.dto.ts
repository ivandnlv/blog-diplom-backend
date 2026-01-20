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

  @ApiPropertyOptional({
    example: true,
    description:
      'Ссылка на файл картинки, например: https://avatars.mds.yandex.net/i?id=4888b77867180de87ce8a65417c30d00_l-5910699-images-thumbs&n=13',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Массив ссылок на картинки, которые прикреплены внутри content',
  })
  @IsOptional()
  @IsArray()
  contentImagesUrls?: string[];
}
