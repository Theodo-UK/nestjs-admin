import { INestApplication, Module, Inject } from '@nestjs/common'
import { Test, TestingModuleBuilder } from '@nestjs/testing'
import { getEntityManagerToken, getConnectionToken, TypeOrmModule } from '@nestjs/typeorm'
import { merge as _merge } from 'lodash'
import { AdminCoreModuleFactory } from '../../adminCore/adminCore.module'
import DefaultAdminSite from '../../adminCore/adminSite'
import { TestTypeOrmModule } from './testTypeOrmModule'
import { TestAuthModule } from './testAuth.module'
import { EntityType } from '../../types'
import { injectionTokens } from '../../tokens'
import { User } from '../../../exampleApp/src/user/user.entity'
import { Group } from '../../../exampleApp/src/user/group.entity'
import { Agency } from '../../../exampleApp/src/user/agency.entity'

export interface TestApplication extends INestApplication {
  startTest: () => Promise<void>
  stopTest: () => Promise<void>
  testStarted: boolean
  doClose: INestApplication['close']
}

function createRegistrationModule(registrables: EntityType[], adminModules: any[]) {
  @Module({ imports: [...adminModules] })
  class AdminRegistrationModule {
    constructor(@Inject(injectionTokens.ADMIN_SITE) private readonly adminSite: DefaultAdminSite) {
      registrables.forEach((registrable) => {
        adminSite.register('test', registrable)
      })
    }
  }

  return AdminRegistrationModule
}

type TestingOptions = {
  adminModule?: any
  adminAuthModule?: any
  adminCoreModule?: any
  registerEntities: any[]
  imports: any[]
}

const defaultTestingOptions: TestingOptions = {
  adminModule: null,
  adminAuthModule: TestAuthModule, // Authentication is skipped by default
  adminCoreModule: AdminCoreModuleFactory.createAdminCoreModule({}),
  registerEntities: [],
  imports: [],
}

export async function createTestingModule(
  testingOptions: Partial<TestingOptions> = {},
): Promise<TestingModuleBuilder> {
  const options: TestingOptions = _merge({}, defaultTestingOptions, testingOptions)
  // @ts-ignore
  const adminModules = options.adminModule
    ? [options.adminModule]
    : [options.adminAuthModule, options.adminCoreModule]

  const testingModuleBuilder: TestingModuleBuilder = await Test.createTestingModule({
    imports: [
      TestTypeOrmModule.forRoot(),
      TypeOrmModule.forFeature([User, Group, Agency]),
      ...adminModules,
      ...options.imports,
      createRegistrationModule(options.registerEntities, adminModules),
    ],
  })
    .overrideProvider(getEntityManagerToken())
    .useFactory({
      factory: (connection: any) => {
        const queryRunner: any = connection.createQueryRunner()
        const entityManager: any = connection.createEntityManager(queryRunner)
        return entityManager
      },
      inject: [getConnectionToken()],
    })

  return testingModuleBuilder
}

export async function createTestApp(
  testingModuleBuilder: TestingModuleBuilder,
): Promise<TestApplication> {
  const testingModule = await testingModuleBuilder.compile()
  const app: TestApplication = testingModule.createNestApplication()

  app.startTest = () => startTest(app)
  app.stopTest = () => stopTest(app)
  app.doClose = app.close
  app.close = () => closeApp(app)

  return app
}

export async function createAndStartTestApp(testingOptions?: Partial<TestingOptions>) {
  const testingModule = await createTestingModule(testingOptions)
  const app = await createTestApp(testingModule)
  await app.init()
  return app
}

export async function startTest(app: TestApplication) {
  if (app.testStarted) {
    throw new Error(
      'You called startTest() twice successively on the same app. Did you forget to call stopTest()?',
    )
  }
  await app.get(getEntityManagerToken()).queryRunner.startTransaction()
  app.testStarted = true
}

export async function stopTest(app: TestApplication) {
  if (!app.testStarted) {
    throw new Error(
      'You called stopTest() on an app without having started a test. Did you forget to call startTest()?',
    )
  }
  await app.get(getEntityManagerToken()).queryRunner.rollbackTransaction()
  app.testStarted = false
}

async function closeApp(app) {
  if (app.testStarted) {
    throw new Error(
      'You called app.close() on an app that was running a test. Did you forget to call stopTest()?',
    )
  }
  app.doClose()
}
