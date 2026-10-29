import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfirmationTemplate } from './templates/confirmation.template.js';
import { render } from '@react-email/components';
import { ResetPasswordTemplate } from './templates/reset-password.template.js';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template.js';

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    public async sendConfirmationEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
        const html = await render(ConfirmationTemplate({ domain, token }));

        return this.sendMail(email, 'Подтверждение почты', html)
    }

    public async sendPasswordResetEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
        const html = await render(ResetPasswordTemplate({ domain, token }));

        return this.sendMail(email, 'Сброс пароля', html)
    }

    public async sendTwoFactorTokenEmail(email: string, token: string) {
        const html = await render(TwoFactorAuthTemplate({ token }));

        return this.sendMail(email, 'Подтверждение вашей личности', html)
    }

    private async sendMail(email: string, subject: string, html: string): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject,
            html
        });
    }
}
