import { IsNotEmpty, IsString } from 'class-validator';


export class ConfirmationDto {
    @IsString({ message: 'Token должен быть строкой.' })
    @IsNotEmpty({ message: 'Token обязателен.' })
    token: string;
}