// src/users/users.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: number; // было string
    email: string;
    role: string;
  };
}

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    // req.user заполняется JwtStrategy.validate
    if (!req.user) {
      // Теоретически сюда не должны попасть, если guard работает
      return null;
    }

    return {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    };
  }
}
