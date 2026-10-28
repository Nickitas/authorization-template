import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service.js';
import type { Request } from 'express';
import { ConfirmationDto } from './dto/confirmation.dto.js';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async newVerification(
    @Req() req: Request,
    @Body() dto: ConfirmationDto,
  ) {
    return this.emailConfirmationService.newVerification(req, dto);
  }
}
