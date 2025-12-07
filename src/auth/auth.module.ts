// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import type { StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.register({
      // временная простая конфигурация
      secret: process.env.JWT_SECRET || 'default-jwt-secret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || '3600s',
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
