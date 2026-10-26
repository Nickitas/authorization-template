import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthProviderGuard } from './guards/provider.guard.js';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service.js';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,

  ) { }

  @Recaptcha()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(
    @Req() req: Request,
    @Body() dto: RegisterDto
  ) {
    return this.authService.register(req, dto);
  }

  @Recaptcha()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(
    @Req() req: Request,
    @Body() dto: LoginDto
  ) {
    return this.authService.login(req, dto);
  }

  @Get('/oauth/callback/:provider')
  @UseGuards(AuthProviderGuard)
  public async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string,
  ) {
    if (!code) {
      throw new BadRequestException(
        'Не был предоставлен код авторизации.'
      )
    }

    await this.authService.extractProfileFromCode(req, provider, code);

    return res.redirect(`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`);
  }


  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    const providerInstance = this.providerService.findByService(provider);

    return {
      url: providerInstance?.getAuthUrl()
    }
  }


  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(req, res);
  }
}
