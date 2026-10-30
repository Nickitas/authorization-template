import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class UpdateUserDto {
    @IsString({ message: 'Имя должно быть строкой.' })
    @IsNotEmpty({ message: 'Поле обязательно.' })
    name: string;

    @IsString({ message: 'Email должен быть строкой.' })
    @IsNotEmpty({ message: 'Поле обязательно.' })
    @IsEmail({}, { message: 'Некорректный формат.' })
    email: string;

    @IsBoolean({ message: 'isTwoFactorEnabled должно быт булевым значением.' })
    isTwoFactorEnabled: boolean;
}