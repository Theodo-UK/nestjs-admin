import { Module } from '@nestjs/common'
import { DefaultAdminController } from './admin.controller'
import DefaultAdminSite from './adminSite'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import { injectionTokens } from './tokens'
import DefaultAdminAppConfigurator, { AdminAppConfigurationOptions } from './admin.configurator'
import { DeepPartial } from 'typeorm'

export interface AdminCoreModuleConfig {
  adminSite?: typeof DefaultAdminSite
  adminController?: typeof DefaultAdminController
  adminEnvironment?: typeof DefaultAdminNunjucksEnvironment
  adminAppConfigurator?: typeof DefaultAdminAppConfigurator
  appConfig?: DeepPartial<AdminAppConfigurationOptions>
}

@Module({})
export class AdminCoreModuleFactory {
  static createAdminCoreModule({
    adminSite = DefaultAdminSite,
    adminController = DefaultAdminController,
    adminEnvironment = DefaultAdminNunjucksEnvironment,
    adminAppConfigurator = DefaultAdminAppConfigurator,
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
    const adminAppConfiguratorProvider = {
      provide: injectionTokens.ADMIN_APP_CONFIGURATOR,
      useExisting: adminAppConfigurator,
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
      adminAppConfigurator,
      adminAppConfiguratorProvider,
      appConfigProvider,
    ]

    return {
      module: AdminCoreModuleFactory,
      controllers: [adminController],
      providers: exportedProviders,
      exports: exportedProviders,
    }
  }
}
