// src/users/users.controller.ts
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: CurrentUser) {
    // req.user заполняется JwtStrategy.validate
    if (!user) {
      // Теоретически сюда не должны попасть, если guard работает
      return null;
    }

    return this.usersService.getMe(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: CurrentUser, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(user, dto);
  }
}
