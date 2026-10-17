import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserService } from '@/user/user.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule { }
