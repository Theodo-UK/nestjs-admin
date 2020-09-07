import { injectionTokens } from '../tokens';
import { ModuleMetadata } from '@nestjs/common/interfaces';
export declare type CredentialValidator = (username: string, password: string) => object | null | Promise<object | null>;
export interface CredentialValidatorProvider {
    useFactory: (dep: any) => CredentialValidator;
    inject?: any[];
}
interface AdminAuthModuleConfig {
    adminCoreModule: any;
    credentialValidator: CredentialValidatorProvider;
    imports: ModuleMetadata['imports'];
    providers: ModuleMetadata['providers'];
}
export declare class AdminAuthModuleFactory {
    static createAdminAuthModule({ adminCoreModule, credentialValidator, providers, imports, }: Partial<AdminAuthModuleConfig>): {
        module: typeof AdminAuthModuleFactory;
        imports: any[];
        exports: (import("@nestjs/common").Type<any> | import("@nestjs/common").ClassProvider<any> | import("@nestjs/common").ValueProvider<any> | import("@nestjs/common").FactoryProvider<any> | import("@nestjs/common").ExistingProvider<any> | {
            provide: injectionTokens;
            useFactory: (dep: any) => CredentialValidator;
            inject: any[];
        })[];
        providers: (import("@nestjs/common").Type<any> | import("@nestjs/common").ClassProvider<any> | import("@nestjs/common").ValueProvider<any> | import("@nestjs/common").FactoryProvider<any> | import("@nestjs/common").ExistingProvider<any> | {
            provide: injectionTokens;
            useFactory: (dep: any) => CredentialValidator;
            inject: any[];
        })[];
    };
}
export {};
