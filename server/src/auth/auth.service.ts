import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service.js';
import { AuthMethod, User } from '@prisma/__generated__/index.js';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    public constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService
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

        return this.saveSession(req, newUser);
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

        return this.saveSession(req, user);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException('Не удалось завершить сессию. Возможно, возникла проблема с сервером млм сессия уже была завершена.')
                    );
                }

                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
                resolve();
            })
        })
    }

    private async saveSession(req: Request, user: User) {
        // console.log(`Session saved. User: ${user}`);

        return new Promise((resolve, reject) => {
            req.session.userId = user.id;

            req.session.save(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException('Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.')
                    )
                }

                resolve({
                    user
                })
            })
        })
    }
}
