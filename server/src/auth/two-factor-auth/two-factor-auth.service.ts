import { MailService } from '@/libs/mail/mail.service.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TokenType } from '@prisma/__generated__/index.js';

@Injectable()
/**
 * Двухфакторная аутентификация: отправка 6-значного кода на почту
 * и его проверка при входе.
 */
export class TwoFactorAuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) { }

    /**
     * Проверяет код 2FA: существование токена, совпадение кода и срок
     * действия (5 минут), после чего удаляет использованный токен.
     *
     * @param email - адрес пользователя
     * @param code - код из письма
     * @returns `true`, если код действителен
     * @throws {NotFoundException} Если токен 2FA не найден
     * @throws {BadRequestException} Если код неверный или истёк
     */
    public async validateTwoFactorToken(email: string, code: string) {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        });

        if (!existingToken) {
            throw new NotFoundException('Token 2FA не найден. Пожалуйста, убедитесь, что  запрашивали token для данного адреса электронной почты.');
        }

        if (existingToken.token !== code) {
            throw new BadRequestException('Неверный код 2FA. Проверьте введенный код и попробуйте снова.');
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException('Срок действия 2FA token истек. Запросите новый token.');
        }

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.TWO_FACTOR
            }
        });

        return true;
    }

    /**
     * Генерирует и отправляет на почту код 2FA (действует 5 минут).
     *
     * @param email - адрес пользователя
     * @returns `true` после отправки письма
     */
    public async sendTwoFactorToken(email: string) {
        const twoFactorToken = await this.generateTwoFactorToken(email);

        await this.mailService.sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token,
        );

        return true;
    }

    /**
     * Создаёт 6-значный код со сроком действия 5 минут, предварительно
     * удаляя прежний токен этого типа.
     */
    private async generateTwoFactorToken(email: string) {
        const token = Math.floor(
            Math.random() * (1_000_000 - 100_000) + 100_000
        ).toString();
        const expiresIn = new Date(new Date().getTime() + 300_000);

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.TWO_FACTOR
                }
            })
        }

        const twoFactorToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.TWO_FACTOR
            }
        })

        return twoFactorToken;
    }
}
