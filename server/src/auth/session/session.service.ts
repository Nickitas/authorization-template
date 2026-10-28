import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/__generated__/index.js';
import { Request, Response } from 'express';

@Injectable()
export class SessionService {
    public constructor(private readonly configService: ConfigService) { }

    public save(req: Request, user: User) {
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

    public destroy(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException('Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.')
                    );
                }

                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
                resolve();
            })
        })
    }
}
