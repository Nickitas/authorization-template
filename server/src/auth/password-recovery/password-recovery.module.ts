import { Module } from '@nestjs/common';

import { PasswordRecoveryService } from './password-recovery.service.js';
import { PasswordRecoveryController } from './password-recovery.controller.js';

import { UserService } from '@/user/user.service.js';
import { MailService } from '@/libs/mail/mail.service.js';

@Module({
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, UserService, MailService],
})
export class PasswordRecoveryModule { }
