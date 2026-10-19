import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Authorized } from '@/auth/decorators/authorized.decorator.js';
import { Authorization } from '@/auth/decorators/auth.decorator.js';
import { UserRole } from '@prisma/__generated__/index.js';

import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
