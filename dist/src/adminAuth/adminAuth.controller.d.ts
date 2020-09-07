import { Request } from 'express';
import DefaultAdminNunjucksEnvironment from '../adminCore/admin.environment';
export declare class AdminAuthController {
    private env;
    constructor(env: DefaultAdminNunjucksEnvironment);
    login(request: Request): Promise<unknown>;
    adminLogin(res: any): Promise<void>;
    logout(req: any, res: any): Promise<void>;
}
