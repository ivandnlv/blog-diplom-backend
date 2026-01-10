// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: CurrentUser) {
    // req.user заполняется JwtStrategy.validate
    if (!user) {
      // Теоретически сюда не должны попасть, если guard работает
      return null;
    }

    return user;
  }
}
