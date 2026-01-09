import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class ModerateCommentDto {
  @ApiProperty({
    example: false,
    description: 'Одобрить/отклонить комментарий',
  })
  @IsBoolean()
  isApproved: boolean;

  @ApiPropertyOptional({
    example: 'Спам / оскорбления / ссылки на запрещённые ресурсы',
    description: 'Причина отклонения. Обязательна, если isApproved = false',
  })
  @ValidateIf((dto: ModerateCommentDto) => dto.isApproved === false)
  @IsString()
  @Length(1, 500)
  moderationReason?: string;
}
