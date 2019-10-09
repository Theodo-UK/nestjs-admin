import { AdminCoreModuleFactory } from '../adminCore/adminCore.module'
import DefaultAdminSite from '../adminCore/adminSite'
import {
  defaultAdminConfigurationOptions,
  AdminAppConfigurationOptions,
} from '../adminCore/admin.configuration'
import { DefaultAdminController } from '../adminCore/admin.controller'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../adminCore/admin.environment'
import { MemoryStore } from 'express-session'
import { DeepPartial } from 'typeorm'
import { createAndStartTestApp, TestApplication } from './utils/testApp'

describe('AdminCoreModuleFactory', () => {
  let app: TestApplication

  it('should return the default admin site and environment when passed no params', async () => {
    const CustomAdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})
    app = await createAndStartTestApp({ adminCoreModule: CustomAdminCoreModule })
    await app.startTest()

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(DefaultAdminSite)

    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    expect(adminEnv).toBeInstanceOf(DefaultAdminNunjucksEnvironment)

    await app.stopTest()
    await app.close()
  })

  it('should allow to configure the admin core site and controller', async () => {
    class CustomAdminSite extends DefaultAdminSite {}
    class CustomAdminController extends DefaultAdminController {}
    class CustomAdminEnvironment extends DefaultAdminNunjucksEnvironment {}
    const appConfig: DeepPartial<AdminAppConfigurationOptions> = {
      session: {
        store: new MemoryStore(),
      },
    }

    const CustomAdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({
      adminSite: CustomAdminSite,
      adminController: CustomAdminController,
      adminEnvironment: CustomAdminEnvironment,
      appConfig,
    })
    app = await createAndStartTestApp({ adminCoreModule: CustomAdminCoreModule })
    await app.startTest()

    expect(app.get(CustomAdminController)).toBeInstanceOf(CustomAdminController)
    expect(() => app.get(DefaultAdminController)).toThrow()

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(CustomAdminSite)
    expect(app.get(CustomAdminSite)).toBe(adminSite)
    expect(() => app.get(DefaultAdminSite)).toThrow()

    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    expect(adminEnv).toBeInstanceOf(CustomAdminEnvironment)
    expect(app.get(CustomAdminEnvironment)).toBe(adminEnv)
    expect(() => app.get(DefaultAdminNunjucksEnvironment)).toThrow()

    const appConfiguration = app.get(injectionTokens.APP_CONFIG)
    expect(appConfiguration).toMatchObject({ ...defaultAdminConfigurationOptions, ...appConfig })

    await app.stopTest()
    await app.close()
  })
})
