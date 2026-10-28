import { Module } from '@nestjs/common';

import { MailModule } from '@/libs/mail/mail.module.js';

import { EmailConfirmationService } from './email-confirmation.service.js';
import { EmailConfirmationController } from './email-confirmation.controller.js';
import { UserService } from '@/user/user.service.js';
import { MailService } from '@/libs/mail/mail.service.js';
import { SessionModule } from '../session/session.module.js';

@Module({
  imports: [MailModule, SessionModule],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule { }
