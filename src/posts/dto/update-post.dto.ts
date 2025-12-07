import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'Обновлённый заголовок поста',
    description: 'Новый заголовок поста',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @ApiPropertyOptional({
    example: 'Обновлённый контент поста',
    description: 'Новый контент поста',
  })
  @IsOptional()
  @IsString()
  @Length(1, 5000)
  content?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Изменённый статус публикации поста',
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
