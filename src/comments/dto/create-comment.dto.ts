import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({ example: 'Текст комментария' })
  @IsString()
  @Length(1, 5000)
  content: string;

  @ApiPropertyOptional({
    example: 123,
    description: 'ID родительского комментария',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  parentId?: number;
}
