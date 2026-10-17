import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

expand(dotenv.config());

import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Redis } from 'ioredis';
import { RedisStore } from 'connect-redis';
import { ms, StringValue } from './libs/common/utils/ms.util.js';
import { parseBool } from './libs/common/utils/parse-bool.util.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const config = app.get(ConfigService);
  const redis = new Redis(config.getOrThrow('REDIS_URI'));

  app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.use(session({
    secret: config.getOrThrow('SESSION_SECRET'),
    name: config.getOrThrow('SESSION_NAME'),
    resave: true,
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow<string>('SESSION_DOMAIN'),
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
      httpOnly: parseBool(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: parseBool(config.getOrThrow<string>('SESSION_SECURE')),
      sameSite: 'lax',
    },

    store: new RedisStore({
      client: redis,
      prefix: config.getOrThrow<string>('SESSION_FOLDER'),
    }),

  }))

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credential: true,
    exposedHeaders: ['set-cookie']
  });

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
await bootstrap();
