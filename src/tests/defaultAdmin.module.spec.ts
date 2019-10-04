import DefaultAdminSite from '../adminSite'
import { injectionTokens } from '../tokens'
import DefaultAdminNunjucksEnvironment from '../admin.environment'
import { DefaultAdminModule } from '..'
import { TestApplication, createAndStartTestApp } from './utils/testApp'

describe('DefaultAdminModule', () => {
  let app: TestApplication

  beforeAll(async () => {
    app = await createAndStartTestApp({ adminModule: DefaultAdminModule })
  })

  beforeEach(async () => {
    await app.startTest()
  })

  afterEach(async () => {
    await app.stopTest()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the default admin site and environment', async () => {
    const adminSite = app.get(injectionTokens.ADMIN_SITE)
    expect(adminSite).toBeInstanceOf(DefaultAdminSite)

    const adminEnv = app.get(injectionTokens.ADMIN_ENVIRONMENT)
    expect(adminEnv).toBeInstanceOf(DefaultAdminNunjucksEnvironment)
  })
})
