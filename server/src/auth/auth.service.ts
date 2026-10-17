import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '@/user/user.service.js';
import { AuthMethod, User } from '@prisma/__generated__/index.js';
import { Request } from 'express';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
    public constructor(private readonly userService: UserService) { }

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

    public async login() { }

    public async logout() { }

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
