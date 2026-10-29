import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MailModule } from './libs/mail/mail.module.js';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module.js';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module.js';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
    TwoFactorAuthModule
  ],
})
export class AppModule { }
