import { ConfigService } from '@nestjs/config';

import { MailerOptions } from '@nestjs-modules/mailer';
import { isDev } from '@/libs/common/utils/is-dev.util.js';

export const getMailerConfig = async (configService: ConfigService): Promise<MailerOptions> => ({
    transport: {
        host: configService.getOrThrow<string>('MAIL_HOST'),
        port: configService.getOrThrow<number>('MAIL_PORT'),
        secure: !isDev(configService),
        auth: {
            user: configService.getOrThrow<string>('MAIL_LOGIN'),
            pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
        }
    },
    defaults: {
        from: `"Auth Team" ${configService.getOrThrow<string>('MAIL_LOGIN')}`
    }
});