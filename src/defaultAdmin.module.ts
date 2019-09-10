import { Module } from '@nestjs/common'
import { AdminCoreModuleFactory } from './adminCore.module'
import { AdminAuthModuleFactory } from './adminAuth.module'
import DefaultAdminSite from './adminSite'
import AdminUserEntity from './adminUser.entity'

const AdminAuthModule = AdminAuthModuleFactory.createAdminAuthModule({})
const AdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

@Module({
  imports: [AdminCoreModule, AdminAuthModule],
  exports: [AdminCoreModule, AdminAuthModule],
})
export default class DefaultAdminModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
