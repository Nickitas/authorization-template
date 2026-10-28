import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service.js';
import { PasswordRecoveryController } from './password-recovery.controller.js';

@Module({
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
