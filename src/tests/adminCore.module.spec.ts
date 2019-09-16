import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AdminCoreModuleFactory } from '../adminCore.module'
import DefaultAdminSite from '../adminSite'
import {
  defaultAdminConfigurationOptions,
  AdminAppConfigurationOptions,
} from '../admin.configuration'
import { DefaultAdminController } from '../admin.controller'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../admin.environment'
import { MemoryStore } from 'express-session'
import { DeepPartial } from 'typeorm'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'

describe('AdminCoreModuleFactory', () => {
  let app: INestApplication

  afterEach(async () => {
    await app.close()
  })

  it('should return the default admin site and environment when passed no params', async () => {
    const CustomAdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule.forRoot(), CustomAdminCoreModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(DefaultAdminSite)

    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    expect(adminEnv).toBeInstanceOf(DefaultAdminNunjucksEnvironment)
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
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule.forRoot(), CustomAdminCoreModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

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
  })
})
