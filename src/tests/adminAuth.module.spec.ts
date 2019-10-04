import { Test, TestingModule } from '@nestjs/testing'
import { AdminAuthModuleFactory } from '../adminAuth.module'
import DefaultAdminSite from '../adminSite'
import { DefaultAdminController } from '../admin.controller'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../admin.environment'
import { AdminCoreModuleFactory } from '../adminCore.module'
import { TestTypeOrmModule } from './utils/testTypeOrmModule'
import { createTestApp, createTestingModule, createAndStartTestApp } from './utils/testApp'

describe('AdminAuthModuleFactory', () => {
  it('should return the default admin site and environment when passed no params', async () => {
    const app = await createAndStartTestApp()
    await app.startTest()

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(DefaultAdminSite)

    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    expect(adminEnv).toBeInstanceOf(DefaultAdminNunjucksEnvironment)

    await app.stopTest()
    await app.close()
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

    const app = await createAndStartTestApp({ adminCoreModule: CustomAdminCoreModule })
    await app.startTest()

    expect(app.get(CustomAdminController)).toBeInstanceOf(CustomAdminController)
    expect(() => app.get(DefaultAdminController)).toThrow()

    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(CustomAdminSite)
    expect(app.get(CustomAdminSite)).toBe(adminSite)
    expect(() => app.get(DefaultAdminSite)).toThrow()

    expect(() => app.get(DefaultAdminNunjucksEnvironment)).toThrow()

    await app.stopTest()
    await app.close()
  })
})
