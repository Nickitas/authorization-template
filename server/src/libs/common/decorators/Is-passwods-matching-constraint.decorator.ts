import { RegisterDto } from '@/auth/dto/register.dto.js';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
    public validate(passwordRepeat: string, args: ValidationArguments) {
        const obj = args.object as RegisterDto;

        return obj.password === passwordRepeat;
    }

    public defaultMessage() {
        return 'Пароли не совпадают.'
    }
}