import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsString()
  @Length(6, 72)
  password: string;

  @ApiProperty()
  @IsString()
  @Length(1, 64)
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
