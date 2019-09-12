import { HttpAdapterHost } from '@nestjs/core'
import { Module, MiddlewareConsumer, NestModule, Inject } from '@nestjs/common'
import { DeepPartial } from 'typeorm'
import flash = require('connect-flash')
import * as session from 'express-session'
import * as passport from 'passport'
import { join } from 'path'

import { DefaultAdminController } from './admin.controller'
import DefaultAdminSite from './adminSite'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import { injectionTokens } from './tokens'
import { AdminAppConfigurationOptions, createAppConfiguration } from './admin.configuration'

export interface AdminCoreModuleConfig {
  adminSite?: typeof DefaultAdminSite
  adminController?: typeof DefaultAdminController
  adminEnvironment?: typeof DefaultAdminNunjucksEnvironment
  appConfig?: DeepPartial<AdminAppConfigurationOptions>
}

export const publicFolder = join(__dirname, 'public')

@Module({})
export class AdminCoreModuleFactory implements NestModule {
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
      useValue: createAppConfiguration(appConfig),
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
    @Inject(injectionTokens.APP_CONFIG) private readonly appConfig: AdminAppConfigurationOptions,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    // @debt TODO "use our own Passport instance when https://github.com/nestjs/passport/issues/26 is fixed"
    passport.serializeUser(this.appConfig.serializeUser)
    passport.deserializeUser(this.appConfig.deserializeUser)
    this.adapterHost.httpAdapter.useStaticAssets(publicFolder, {
      prefix: this.appConfig.assetPrefix,
    })

    consumer
      .apply(session(this.appConfig.session), passport.initialize(), passport.session(), flash())
      .forRoutes('/admin/?')
  }
}
