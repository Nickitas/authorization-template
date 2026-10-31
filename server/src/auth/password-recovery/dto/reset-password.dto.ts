import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Адрес почты должен быть корректным.' })
    @IsNotEmpty({ message: 'Email обязателен.' })
    email: string;
}