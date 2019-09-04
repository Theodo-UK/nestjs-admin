import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoreAdminModule, CoreAdminModuleFactory } from '../admin.module'
import DefaultAdminSite from '../adminSite'
import { DefaultAdminController } from '../admin.controller'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../admin.environment'

describe('AppController', () => {
  let app: INestApplication

  afterEach(async () => {
    await app.close()
  })

  it('should expose a default admin module ready to be used', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CoreAdminModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    expect(app.get(DefaultAdminController)).toBeInstanceOf(DefaultAdminController)

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(DefaultAdminSite)
    expect(app.get(DefaultAdminSite)).toBe(adminSite)

    // Env isn't properly defined because it is request-scoped, see https://github.com/nestjs/nest/issues/2049
    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    expect(adminEnv).toEqual(null)
    // @debt test "miker: had to remove nunjucks test, think it's related to an nestjs version update"
  })

  it('should allow to create your own admin module with defaults', async () => {
    const CustomAdminModule = CoreAdminModuleFactory.createAdminModule({})
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CustomAdminModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    expect(CustomAdminModule).toEqual(CoreAdminModule)
  })

  it('should allow to configure the admin site and controller', async () => {
    class CustomAdminSite extends DefaultAdminSite {}
    class CustomAdminController extends DefaultAdminController {}
    class CustomAdminEnvironment extends DefaultAdminNunjucksEnvironment {}

    const CustomAdminModule = CoreAdminModuleFactory.createAdminModule({
      adminSite: CustomAdminSite,
      adminController: CustomAdminController,
      adminEnvironment: CustomAdminEnvironment,
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
