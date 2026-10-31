import { IsString } from 'class-validator';


export class NewPasswordDto {
    @IsString()
    password: string;
}