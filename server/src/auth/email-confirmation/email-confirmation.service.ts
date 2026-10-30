import { PrismaService } from '@/prisma/prisma.service.js';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TokenType, User } from '@prisma/__generated__/index.js';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationDto } from './dto/confirmation.dto.js';
import { MailService } from '@/libs/mail/mail.service.js';
import { UserService } from '@/user/user.service.js';
import { SessionService } from '../session/session.service.js';

@Injectable()
/**
 * Подтверждение email: отправка токена верификации при регистрации
 * и активация учётной записи по токену из письма.
 */
export class EmailConfirmationService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) { }

    /**
     * Подтверждает email по токену: помечает пользователя как
     * isVerified = true, удаляет использованный токен и создаёт сессию.
     *
     * @param dto - токен подтверждения из письма
     * @returns Результат создания сессии
     * @throws {NotFoundException} Если токен или пользователь не найдены
     * @throws {BadRequestException} Если срок действия токена истёк
     */
    public async newVerification(req: Request, dto: ConfirmationDto) {
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token: dto.token,
                type: TokenType.VERIFICATION
            }
        })

        if (!existingToken) {
            throw new NotFoundException('Token подтвержден не найден. Пожалуйста, убедитесь, что у вас правильный token.');
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException('Token истек. Запросите новый token подтверждения.');
        }

        const existingUser = await this.userService.findByEmail(existingToken.email);

        if (!existingUser) {
            throw new NotFoundException('Пользователь не найден. Убедитесь, что email введен верно.');
        }

        await this.prismaService.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                isVerified: true
            }
        });

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.VERIFICATION,
            }
        })


        return this.sessionService.save(req, existingUser);
    }

    /**
     * Генерирует и отправляет на почту токен подтверждения (действует 1 час).
     *
     * @param email - адрес пользователя
     * @returns `true` после отправки письма
     */
    public async sendVerificationToken(email: string) {
        const verificationToken = await this.generateVerificationToken(email);

        await this.mailService.sendConfirmationEmail(
            verificationToken.email,
            verificationToken.token,
        )

        return true;
    }

    /**
     * Создаёт токен подтверждения со сроком действия 1 час, предварительно
     * удаляя прежний токен этого типа.
     */
    private async generateVerificationToken(email: string) {
        const token = uuidv4();
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.VERIFICATION
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.VERIFICATION
                }
            })
        }

        const verificationToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.VERIFICATION
            }
        })

        return verificationToken;
    }
}
