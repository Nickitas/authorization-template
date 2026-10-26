import { ConfigService } from '@nestjs/config';

import { TypeOptions } from '@/auth/provider/provider.constants.js';
import { GoogleProvider } from '@/auth/provider/services/google.provider.js';
import { YandexProvider } from '@/auth/provider/services/yandex.provider.js';

export const getProvidersConfig = async (configService: ConfigService): Promise<TypeOptions> => ({
    baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
    services: [
        new GoogleProvider({
            client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            scopes: ['email', 'profile']
        }),
        new YandexProvider({
            client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
            client_secret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
            scopes: ['login:email', 'login:avatar', 'login:info']
        }),
    ]
});