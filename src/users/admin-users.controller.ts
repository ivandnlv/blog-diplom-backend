import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginatedResult } from '../common/pagination/pagination.types';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { UsersService } from './users.service';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@ApiTags('Admin / Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /admin/users?page=&limit=
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllUsers(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.usersService.findAllPaginated(page, limit);
  }

  // PATCH /admin/users/:id
  @Patch(':id')
  async updateUser(
    @Param('id') idParam: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.usersService.adminUpdateUser(id, dto);
  }

  // DELETE /admin/users/:id
  @Delete(':id')
  async deleteUser(@Param('id') idParam: string): Promise<void> {
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid user id');
    }

    await this.usersService.deleteUser(id);
  }
}
