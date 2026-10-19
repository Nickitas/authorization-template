import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(
    @Req() req: Request,
    @Body() dto: RegisterDto
  ) {
    return this.authService.register(req, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Req() req: Request,
    @Body() dto: LoginDto
  ) {
    return this.authService.login(req, dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(req, res);
  }
}
