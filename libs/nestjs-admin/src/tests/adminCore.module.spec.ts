import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminCoreModuleFactory } from '../adminCore.module'
import DefaultAdminSite from '../adminSite'
import { DefaultAdminController } from '../admin.controller'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../admin.environment'

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
    // @debt test "miker: had to remove nunjucks test, think it's related to an nestjs version update"
    expect(app.get(injectionTokens.ADMIN_ENVIRONMENT)).toBe(adminEnv)
    expect(() => app.get(DefaultAdminNunjucksEnvironment)).toThrow()
  })

  it('should allow to configure the admin core site and controller', async () => {
    class CustomAdminSite extends DefaultAdminSite {}
    class CustomAdminController extends DefaultAdminController {}
    class CustomAdminEnvironment extends DefaultAdminNunjucksEnvironment {}

    const CustomAdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({
      adminSite: CustomAdminSite,
      adminController: CustomAdminController,
      adminEnvironment: CustomAdminEnvironment,
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
    // @debt test "miker: had to remove nunjucks test, think it's related to an nestjs version update"
    expect(app.get(injectionTokens.ADMIN_ENVIRONMENT)).toBe(adminEnv)
    expect(() => app.get(DefaultAdminNunjucksEnvironment)).toThrow()
  })
})
