import { IsString } from 'class-validator';


export class NewPassportDto {
    @IsString()
    password: string;
}