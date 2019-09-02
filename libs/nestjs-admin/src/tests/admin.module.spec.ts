import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DefaultAdminModule, AdminModuleFactory } from '../admin.module'
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
      imports: [TypeOrmModule.forRoot(), DefaultAdminModule],
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
    expect(app.get(DefaultAdminNunjucksEnvironment)).toEqual({})
  })

  it('should allow to create your own admin module with defaults', async () => {
    const CustomAdminModule = AdminModuleFactory.createAdminModule({})
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CustomAdminModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    expect(CustomAdminModule).toEqual(DefaultAdminModule)
  })

  it('should allow to configure the admin site and controller', async () => {
    class CustomAdminSite extends DefaultAdminSite {}
    class CustomAdminController extends DefaultAdminController {}
    class CustomAdminEnvironment extends DefaultAdminNunjucksEnvironment {}

    const CustomAdminModule = AdminModuleFactory.createAdminModule({
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
    expect(app.get(CustomAdminEnvironment)).toEqual({})
    expect(app.get(injectionTokens.ADMIN_ENVIRONMENT)).toBe(adminEnv)
    expect(() => app.get(DefaultAdminNunjucksEnvironment)).toThrow()
  })
})
