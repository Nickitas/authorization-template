import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserService } from '@/user/user.service.js';

import { getRecaptchaConfig } from '@/config/recaptcha.config.js';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';


import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { ProviderModule } from './provider/provider.module.js';
import { getProvidersConfig } from '@/config/providers.comfig.js';

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
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule { }
