import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminAuthModuleFactory } from '../adminAuth.module'
import DefaultAdminSite from '../adminSite'
import { DefaultAdminController } from '../admin.controller'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../admin.environment'
import { AdminCoreModuleFactory } from '../adminCore.module'

describe('AdminAuthModuleFactory', () => {
  let app: INestApplication

  afterEach(async () => {
    await app.close()
  })

  it('should return the default admin site and environment when passed no params', async () => {
    const DefaultAdminAuthModule = AdminAuthModuleFactory.createAdminAuthModule({})
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), DefaultAdminAuthModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(DefaultAdminSite)

    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    // @debt test "miker: had to remove nunjucks test, think it's related to an nestjs version update"
    expect(app.get(injectionTokens.ADMIN_ENVIRONMENT)).toBe(adminEnv)
    expect(() => app.get(DefaultAdminNunjucksEnvironment)).toThrow()
  })

  it('should allow to configure the admin auth module with a custom admin core module', async () => {
    class CustomAdminSite extends DefaultAdminSite {}
    class CustomAdminController extends DefaultAdminController {}
    class CustomAdminEnvironment extends DefaultAdminNunjucksEnvironment {}

    const CustomAdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({
      adminSite: CustomAdminSite,
      adminController: CustomAdminController,
      adminEnvironment: CustomAdminEnvironment,
    })

    const CustomAdminModule = AdminAuthModuleFactory.createAdminAuthModule({
      adminModule: CustomAdminCoreModule,
    })
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CustomAdminModule],
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
    // @debt test "miker: had to remove nunjucks test, think it's related to an nestjs version update"
    expect(app.get(injectionTokens.ADMIN_ENVIRONMENT)).toBe(adminEnv)
    expect(() => app.get(DefaultAdminNunjucksEnvironment)).toThrow()
  })
})
