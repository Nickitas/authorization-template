import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { type TypeUserInfo } from './types/user-info.types.js';
import { type TypeBaseProviderOptions } from './types/base-provider-options.types.js';

@Injectable()
/**
 * Базовый сервис OAuth-провайдера: строит ссылку на страницу авторизации,
 * обменивает код на токены и загружает профиль пользователя.
 *
 * Конкретные провайдеры (Google, Yandex) наследуются от него и
 * переопределяют `extractUserInfo` под формат своего API.
 */
export class BaseOAuthService {
    private BASE_URL: string;

    public constructor(private readonly options: TypeBaseProviderOptions) { }

    /**
     * Дополняет данные профиля именем провайдера.
     *
     * @param data - сырой профиль из API провайдера
     * @returns Профиль в едином формате `TypeUserInfo`
     */
    protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
        return {
            ...data,
            provider: this.options.name,
        }
    }

    /**
     * Строит URL страницы авторизации провайдера (client_id, redirect_uri,
     * scopes).
     *
     * @returns Готовая ссылка для перенаправления пользователя
     */
    public getAuthUrl() {
        const query = new URLSearchParams({
            response_type: 'code',
            client_id: this.options.client_id,
            redirect_uri: this.getRedirectUrl(),
            scope: (this.options.scopes ?? []).join(' '),
            access_type: 'offline',
            prompt: 'select_account',
        });

        return `${this.options.authorize_url}?${query}`;
    }

    /**
     * Обменивает код авторизации на access token и загружает профиль
     * пользователя.
     *
     * @param code - код авторизации из callback-запроса
     * @returns Профиль пользователя с access/refresh токенами
     * @throws {BadRequestException} Если провайдер не выдал токены
     * @throws {UnauthorizedException} Если профиль не удалось загрузить
     */
    public async findUserByCode(code: string): Promise<TypeUserInfo> {
        const client_id = this.options.client_id;
        const client_secret = this.options.client_secret;

        const tokenQuery = new URLSearchParams({
            client_id,
            client_secret,
            code,
            redirect_uri: this.getRedirectUrl(),
            grant_type: 'authorization_code',
        });

        const tokensRequest = await fetch(this.options.access_url, {
            method: 'POST',
            body: tokenQuery,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        if (!tokensRequest.ok) {
            throw new BadRequestException(
                `Не удалось получить пользователя с ${this.options.profile_url}. Проверьте правильность access token.`
            );
        }

        const tokens = await tokensRequest.json();

        if (!tokens.access_token) {
            throw new BadRequestException(
                `Нет токенов с ${this.options.access_url}. Убедитесь, что код авторизации действителен.`
            );
        }

        const userRequest = await fetch(this.options.profile_url, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            }
        });

        if (!userRequest.ok) {
            throw new UnauthorizedException(
                `Не удалось получить пользователя с ${this.options.profile_url}. Проверьте правильность access token.`
            )
        }

        const user = await userRequest.json();
        const userData = await this.extractUserInfo(user);

        return {
            ...userData,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_at || tokens.expires_in,
            provider: this.options.name,
        }
    }

    /**
     * Возвращает callback-URL вида `{BASE_URL}/auth/oauth/callback/{имя провайдера}`.
     */
    public getRedirectUrl() {
        return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
    }

    set baseUrl(value: string) {
        this.BASE_URL = value;
    }

    get name() {
        return this.options.name;
    }

    get access_url() {
        return this.options.access_url;
    }

    get profile_url() {
        return this.options.profile_url;
    }

    get scopes() {
        return this.options.scopes;
    }
}