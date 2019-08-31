import { Module } from '@nestjs/common'
import { DefaultAdminController } from './admin.controller'
import DefaultAdminSite from './adminSite'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import { injectionTokens } from './tokens'

@Module({})
export class AdminModuleFactory {
  static createAdminModule({
    adminSite = DefaultAdminSite,
    adminController = DefaultAdminController,
    adminEnvironment = DefaultAdminNunjucksEnvironment,
  }) {
    const adminSiteProvider = {
      provide: injectionTokens.ADMIN_SITE,
      useExisting: adminSite,
    }
    const adminEnvironmentProvider = {
      provide: injectionTokens.ADMIN_ENVIRONMENT,
      useExisting: adminEnvironment,
    }

    return {
      module: AdminModuleFactory,
      controllers: [adminController],
      // We export the adminSiteProvider, so that the admin site can be injected by the ADMIN_SITE token,
      // but also the adminSite itself so that the developer can use automatic DI by class.
      // Same for the adminEnvironment.
      providers: [adminEnvironment, adminEnvironmentProvider, adminSite, adminSiteProvider],
      exports: [adminEnvironment, adminEnvironmentProvider, adminSite, adminSiteProvider],
    }
  }
}

export const DefaultAdminModule = AdminModuleFactory.createAdminModule({})
