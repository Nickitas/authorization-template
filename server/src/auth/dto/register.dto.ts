import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsPasswordsMatchingConstraint } from '@/libs/common/decorators/Is-passwods-matching-constraint.decorator.js';

export class RegisterDto {
    @IsString({ message: 'Имя должно быть строкой.' })
    @IsNotEmpty({ message: 'Имя обязательно.' })
    name: string;

    @IsString({ message: 'Email должен быть строкой.' })
    @IsEmail({}, { message: 'Некорректный формат email.' })
    @IsNotEmpty({ message: 'Email обязателен.' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой.' })
    @IsNotEmpty({ message: 'Пароль обязателен.' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов.' })
    password: string;

    @Validate(IsPasswordsMatchingConstraint, {
        message: 'Пароли не совпадают.'
    })
    passwordRepeat: string;
}