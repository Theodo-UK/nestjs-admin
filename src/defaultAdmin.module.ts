import { Module } from '@nestjs/common'
import { AdminCoreModuleFactory } from './adminCore.module'
import { AdminAuthModuleFactory } from './adminAuth.module'
import DefaultAdminSite from './adminSite'
import AdminUserEntity from './adminUser.entity'

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})
const DefaultAuthModule = AdminAuthModuleFactory.createAdminAuthModule({
  adminCoreModule: DefaultCoreModule,
})

@Module({
  imports: [DefaultCoreModule, DefaultAuthModule],
  exports: [DefaultCoreModule, DefaultAuthModule],
})
export default class DefaultAdminModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
