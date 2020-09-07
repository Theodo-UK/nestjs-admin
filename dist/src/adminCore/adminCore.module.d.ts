import { HttpAdapterHost } from '@nestjs/core';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { DefaultAdminController } from './admin.controller';
import DefaultAdminSite from './adminSite';
import DefaultAdminNunjucksEnvironment from './admin.environment';
import { injectionTokens } from '../tokens';
import { AdminAppConfigurationOptions } from './admin.configuration';
export interface AdminCoreModuleConfig {
    adminSite?: typeof DefaultAdminSite;
    adminController?: typeof DefaultAdminController;
    adminEnvironment?: typeof DefaultAdminNunjucksEnvironment;
    appConfig?: DeepPartial<AdminAppConfigurationOptions>;
}
export declare class AdminCoreModuleFactory implements NestModule {
    private readonly adapterHost;
    private readonly appConfig;
    static createAdminCoreModule({ adminSite, adminController, adminEnvironment, appConfig, }: AdminCoreModuleConfig): {
        module: typeof AdminCoreModuleFactory;
        controllers: (typeof DefaultAdminController)[];
        providers: (typeof DefaultAdminNunjucksEnvironment | {
            provide: injectionTokens;
            useExisting: typeof DefaultAdminNunjucksEnvironment;
        } | typeof DefaultAdminSite | {
            provide: injectionTokens;
            useExisting: typeof DefaultAdminSite;
        } | {
            provide: injectionTokens;
            useValue: AdminAppConfigurationOptions;
        })[];
        exports: (typeof DefaultAdminNunjucksEnvironment | {
            provide: injectionTokens;
            useExisting: typeof DefaultAdminNunjucksEnvironment;
        } | typeof DefaultAdminSite | {
            provide: injectionTokens;
            useExisting: typeof DefaultAdminSite;
        } | {
            provide: injectionTokens;
            useValue: AdminAppConfigurationOptions;
        })[];
    };
    constructor(adapterHost: HttpAdapterHost, appConfig: AdminAppConfigurationOptions);
    configure(consumer: MiddlewareConsumer): void;
}
