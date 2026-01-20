// src/users/users.controller.ts
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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
