import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from '@/config/mailer.config.js';
import { MailService } from './mail.service.js';

@Module({
  imports: [MailerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: getMailerConfig,
    inject: [ConfigService],
  })],
  providers: [MailService],
})
export class MailModule { }
