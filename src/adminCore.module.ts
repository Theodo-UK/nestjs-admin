import { Module, Inject } from '@nestjs/common'
import { DefaultAdminController } from './admin.controller'
import DefaultAdminSite from './adminSite'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import { injectionTokens } from './tokens'
import { HttpAdapterHost } from '@nestjs/core'
import { configureAdminApp, AdminAppConfigurationOptions } from './setupApp'
import { DeepPartial } from 'typeorm'

export interface AdminCoreModuleConfig {
  adminSite?: typeof DefaultAdminSite
  adminController?: typeof DefaultAdminController
  adminEnvironment?: typeof DefaultAdminNunjucksEnvironment
  appConfig?: DeepPartial<AdminAppConfigurationOptions>
}

@Module({})
export class AdminCoreModuleFactory {
  static createAdminCoreModule({
    adminSite = DefaultAdminSite,
    adminController = DefaultAdminController,
    adminEnvironment = DefaultAdminNunjucksEnvironment,
    appConfig = {},
  }: AdminCoreModuleConfig) {
    const adminSiteProvider = {
      provide: injectionTokens.ADMIN_SITE,
      useExisting: adminSite,
    }
    const adminEnvironmentProvider = {
      provide: injectionTokens.ADMIN_ENVIRONMENT,
      useExisting: adminEnvironment,
    }
    const appConfigProvider = {
      provide: injectionTokens.APP_CONFIG,
      useValue: appConfig,
    }

    // We export the adminSiteProvider, so that the admin site can be injected by the ADMIN_SITE token,
    // but also the adminSite itself so that the developer can use automatic DI by class.
    // Same for the adminEnvironment.
    const exportedProviders = [
      adminEnvironment,
      adminEnvironmentProvider,
      adminSite,
      adminSiteProvider,
      appConfigProvider,
    ]

    return {
      module: AdminCoreModuleFactory,
      controllers: [adminController],
      providers: exportedProviders,
      exports: exportedProviders,
    }
  }

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @Inject(injectionTokens.APP_CONFIG)
    private readonly appConfig: DeepPartial<AdminAppConfigurationOptions>,
  ) {
    if (adapterHost.httpAdapter) {
      configureAdminApp(adapterHost.httpAdapter, appConfig)
    }
  }
}
