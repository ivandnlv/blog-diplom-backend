import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 5000)
  content: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
