import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service.js';
import { AuthMethod, User } from '@prisma/__generated__/index.js';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { verify } from 'argon2';
import { ProviderService } from './provider/provider.service.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service.js';
import { SessionService } from './session/session.service.js';

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly providerService: ProviderService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly sessionService: SessionService,
    ) { }

    public async register(req: Request, dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email);

        if (isExists) {
            throw new ConflictException(
                'Регистрация не удалась. Пользователь с таким email уже существует. Используйте другой email или войдите в систему.'
            );
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false
        );

        await this.emailConfirmationService.sendVerificationToken(newUser)

        return {
            message: 'Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.'
        };
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user || !user.password) {
            throw new NotFoundException(
                'Пользователь не найден. Проверьте введенные данные.'
            );
        }

        const isValidPassword = await verify(user.password, dto.password);

        if (!isValidPassword) {
            throw new UnauthorizedException(
                'Неверный пароль. Попробуйте еще раз или восстановите пароль, если забыли его.'
            );
        }

        if (!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user);
            throw new UnauthorizedException('Email не подтвержден. Проверьте почту и подтвердит адрес.')
        }

        return this.saveSession(req, user);
    }

    public async extractProfileFromCode(req: Request, provider: string, code: string) {
        const providerInstance = this.providerService.findByService(provider);

        if (!providerInstance) {
            throw new NotFoundException(
                `Провайдер "${provider}" не найден. Пожалуйста, проверьте правильность введенных данных.`
            )
        }
        const profile = await providerInstance.findUserByCode(code);

        const account = await this.prismaService.account.findFirst({
            where: {
                id: profile?.id,
                provider: profile?.provider,
            }
        })

        let user = account?.userId ? await this.userService.findById(account.userId) : null;

        if (user) {
            return this.saveSession(req, user);
        }

        const providerKey = profile.provider.toUpperCase();

        if (!(providerKey in AuthMethod)) {
            throw new Error(`Неизвестный OAuth-провайдер: ${profile.provider}`);
        }

        user = await this.userService.create(
            profile.email,
            '',
            profile.name,
            profile.picture,
            AuthMethod[providerKey as keyof typeof AuthMethod],
            true,
        )

        if (!account) {
            await this.prismaService.account.create({
                data: {
                    userId: user.id,
                    type: 'oauth',
                    provider: profile.provider,
                    accessToken: profile.access_token,
                    refreshToken: profile.refresh_token,
                    expiresAt: profile.expires_at ?? 100,
                }
            })
        }

        return this.saveSession(req, user);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return this.sessionService.destroy(req, res);
    }

    public saveSession(req: Request, user: User) {
        return this.sessionService.save(req, user);
    }
}
