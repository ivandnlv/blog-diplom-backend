// src/comments/dto/create-comment.dto.ts
import { IsEmail, IsOptional, IsString, Length, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(1, 100)
  authorName: string;

  @IsOptional()
  @IsEmail()
  authorEmail?: string;

  @IsString()
  @Length(1, 2000)
  content: string;

  @IsOptional()
  @IsInt()
  parentId?: number | null;
}
