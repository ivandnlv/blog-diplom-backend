import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const ctxArr = [ctx.getHandler(), ctx.getClass()];

    const roles = this.reflector.getAllAndOverride<Array<UserRole>>(
      ROLES_KEY,
      ctxArr,
    );

    if (!roles || roles.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { role?: UserRole };

    if (!user?.role || !roles.includes(user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
