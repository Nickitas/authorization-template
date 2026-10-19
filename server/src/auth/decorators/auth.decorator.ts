import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/__generated__/index.js';

import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

import { Roles } from './roles.decorator.js';

export function Authorization(...roles: UserRole[]) {
    if (roles.length > 0) {
        return applyDecorators(
            Roles(...roles),
            UseGuards(AuthGuard, RolesGuard)
        );
    }

    return applyDecorators(UseGuards(AuthGuard));
}