import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'email@mail.ru',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Пароль пользователя',
  })
  @IsString()
  @MinLength(1)
  password: string;
}
