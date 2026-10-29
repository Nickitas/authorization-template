import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserService } from '@/user/user.service.js';

import { getRecaptchaConfig } from '@/config/recaptcha.config.js';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';


import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { ProviderModule } from './provider/provider.module.js';
import { getProvidersConfig } from '@/config/providers.comfig.js';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module.js';
import { MailService } from '@/libs/mail/mail.service.js';
import { SessionModule } from './session/session.module.js';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service.js';

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService]
    }),
    EmailConfirmationModule,
    SessionModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService, TwoFactorAuthService],
  exports: [AuthService]
})
export class AuthModule { }
