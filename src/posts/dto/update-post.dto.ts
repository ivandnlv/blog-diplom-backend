// src/posts/dto/update-post.dto.ts
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 5000)
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
