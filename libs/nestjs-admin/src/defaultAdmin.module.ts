import { Module } from '@nestjs/common'
import { AdminCoreModule } from './coreAdmin.module'
import { AdminAuthModule } from './adminAuth.module'
import DefaultAdminSite from './adminSite'
import AdminUserEntity from './adminUser.entity'

@Module({
  imports: [AdminCoreModule, AdminAuthModule],
  exports: [AdminCoreModule, AdminAuthModule],
})
export default class DefaultAdminModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
