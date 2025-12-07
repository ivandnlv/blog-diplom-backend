// src/posts/dto/update-post.dto.ts
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug can contain only lowercase letters, numbers and dashes',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @Length(1, 5000)
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
