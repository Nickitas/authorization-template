import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';


export class LoginDto {
    @IsString({ message: 'Email должен быть строкой.' })
    @IsEmail({}, { message: 'Некорректный формат email.' })
    @IsNotEmpty({ message: 'Email обязателен.' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой.' })
    @IsNotEmpty({ message: 'Пароль обязателен.' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов.' })
    password: string;

    @IsOptional()
    @IsString()
    code: string;
}