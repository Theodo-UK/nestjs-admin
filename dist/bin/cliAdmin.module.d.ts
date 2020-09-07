import { AdminUserModule } from '../src/adminUser/adminUser.module';
export declare class CliAdminModule {
    static getConnectionOptions(): Promise<import("typeorm").ConnectionOptions>;
    static create(): Promise<{
        module: typeof CliAdminModule;
        imports: (import("@nestjs/common").DynamicModule | typeof AdminUserModule)[];
    }>;
}
