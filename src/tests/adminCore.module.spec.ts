import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AdminCoreModuleFactory } from '../adminCore.module'
import DefaultAdminSite from '../adminSite'
import DefaultAdminAppConfigurator, {
  defaultAdminConfigurationOptions,
} from '../admin.configurator'
import { DefaultAdminController } from '../admin.controller'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../admin.environment'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemoryStore } from 'express-session'

describe('AdminCoreModuleFactory', () => {
  let app: INestApplication

  afterEach(async () => {
    await app.close()
  })

  it('should return the default admin site and environment when passed no params', async () => {
    const CustomAdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CustomAdminCoreModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(DefaultAdminSite)

    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    expect(adminEnv).toBeInstanceOf(DefaultAdminNunjucksEnvironment)

    const adminAppConfigurator = app.get(injectionTokens.ADMIN_APP_CONFIGURATOR)
    expect(adminAppConfigurator).toBeInstanceOf(DefaultAdminAppConfigurator)
  })

  it('should allow to configure the admin core site and controller', async () => {
    class CustomAdminSite extends DefaultAdminSite {}
    class CustomAdminController extends DefaultAdminController {}
    class CustomAdminEnvironment extends DefaultAdminNunjucksEnvironment {}
    class CustomAdminAppConfigurator extends DefaultAdminAppConfigurator {}
    const memoryStore = new MemoryStore()
    const appConfig = {
      session: {
        store: memoryStore,
      },
    }

    const CustomAdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({
      adminSite: CustomAdminSite,
      adminController: CustomAdminController,
      adminEnvironment: CustomAdminEnvironment,
      adminAppConfigurator: CustomAdminAppConfigurator,
      appConfig,
    })
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CustomAdminCoreModule],
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

    const adminAppConfigurator = app.get(injectionTokens.ADMIN_APP_CONFIGURATOR)
    expect(adminAppConfigurator).toBeInstanceOf(CustomAdminAppConfigurator)
    expect(app.get(CustomAdminAppConfigurator)).toBe(adminAppConfigurator)
    expect(() => app.get(DefaultAdminAppConfigurator)).toThrow()

    const appConfiguration = app.get(injectionTokens.APP_CONFIG)
    expect(appConfiguration).toEqual({ ...defaultAdminConfigurationOptions, ...appConfig })
  })
})
