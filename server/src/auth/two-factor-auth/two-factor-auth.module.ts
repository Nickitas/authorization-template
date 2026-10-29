import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service.js';
import { MailService } from '@/libs/mail/mail.service.js';

@Module({
  providers: [TwoFactorAuthService, MailService],
})
export class TwoFactorAuthModule { }
