import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ProviderOptionsSymbol, type TypeOptions } from './provider.constants.js';
import { BaseOAuthService } from './services/base-oauth.service.js';

@Injectable()
/**
 * Реестр OAuth-провайдеров: хранит подключённые сервисы и выдаёт
 * их по имени.
 */
export class ProviderService implements OnModuleInit {
    public constructor(@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions) { }

    /**
     * При старте модуля назначает каждому провайдеру базовый URL приложения.
     */
    public onModuleInit() {
        for (const service of this.options.services) {
            service.baseUrl = this.options.baseUrl;
        }
    }

    /**
     * Возвращает OAuth-провайдера по имени.
     *
     * @param service - имя провайдера (`google`, `yandex`)
     * @returns Провайдер или `null`, если не найден
     */
    public findByService(service: string): BaseOAuthService | null {
        return this.options.services.find(s => s.name === service) ?? null;
    }
}
