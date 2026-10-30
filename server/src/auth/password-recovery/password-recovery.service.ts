import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';
import { MailService } from '@/libs/mail/mail.service.js';
import { UserService } from '@/user/user.service.js';

import { hash } from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { TokenType } from '@prisma/__generated__/index.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { NewPasswordDto } from './dto/new-password.dto.js';


@Injectable()
/**
 * Восстановление пароля: отправка токена сброса на почту и установка
 * нового пароля по этому токену.
 */
export class PasswordRecoveryService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly mailService: MailService,
    ) { }

    /**
     * Отправляет на почту одноразовый токен сброса пароля (действует 1 час).
     *
     * @param dto - email пользователя
     * @returns `true` после отправки письма
     * @throws {NotFoundException} Если пользователь с таким email не найден
     */
    public async resetPassword(dto: ResetPasswordDto) {
        const existingUser = await this.userService.findByEmail(dto.email);

        if (!existingUser) {
            throw new NotFoundException('Пользователь не найден. Проверьте введенный адрес электронной почты и попробуйте снова.');
        }

        const passwordResetToken = await this.generatePasswordResetToken(existingUser.email);

        await this.mailService.sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token
        )

        return true;
    }

    /**
     * Устанавливает новый пароль по токену сброса: проверяет токен и срок
     * действия, хеширует пароль (argon2) и удаляет использованный токен.
     *
     * @param dto - новый пароль
     * @param token - токен сброса из письма
     * @returns `true` после смены пароля
     * @throws {NotFoundException} Если токен или пользователь не найдены
     * @throws {BadRequestException} Если срок действия токена истёк
     */
    public async newPassword(dto: NewPasswordDto, token: string) {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        });

        if (!existingToken) {
            throw new NotFoundException('Token не найден. Проверьте правильность введенного токена или запросите новый.');
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException(
                'Token истек. Запросите новый для подтверждения сброса пароля.'
            );
        }

        const existingUser = await this.userService.findByEmail(existingToken.email);

        if (!existingUser) {
            throw new NotFoundException('Пользователь не найден. Убедитесь, что email введен верно.');
        }

        await this.prismaService.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                password: await hash(dto.password)
            }
        });

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET,
            }
        });

        return true;
    }

    /**
     * Создаёт токен сброса со сроком действия 1 час, предварительно
     * удаляя прежний токен этого типа.
     */
    private async generatePasswordResetToken(email: string) {
        const token = uuidv4();
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.PASSWORD_RESET
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.PASSWORD_RESET
                }
            })
        }

        const passwordResetToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.PASSWORD_RESET
            }
        })

        return passwordResetToken;
    }
}
