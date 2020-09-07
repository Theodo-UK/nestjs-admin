import { ExecutionContext } from '@nestjs/common';
declare const LoginGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LoginGuard extends LoginGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
