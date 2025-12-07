import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  private validateAdminCredentials(email: string, password: string): boolean {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      // Здесь можно было бы кинуть InternalServerErrorException,
      // но для простоты возвращаем false, а ошибка пойдёт как 401.
      return false;
    }

    return email === adminEmail && password === adminPassword;
  }

  login(email: string, password: string): { accessToken: string } {
    const isValid = this.validateAdminCredentials(email, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Пока заглушка. На следующем шаге заменим это на реальный JWT.
    return {
      accessToken: 'dummy-token',
    };
  }
}
