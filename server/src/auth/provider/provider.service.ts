import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ProviderOptionsSymbol, type TypeOptions } from './provider.constants.js';
import { BaseOAuthService } from './services/base-oauth.service.js';

@Injectable()
export class ProviderService implements OnModuleInit {
    public constructor(@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions) { }

    public onModuleInit() {
        for (const service of this.options.services) {
            service.baseUrl = this.options.baseUrl;
        }
    }

    public findByService(service: string): BaseOAuthService | null {
        return this.options.services.find(s => s.name === service) ?? null;
    }
}
