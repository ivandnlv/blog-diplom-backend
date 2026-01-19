import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminCommentListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  postId?: number;
}
