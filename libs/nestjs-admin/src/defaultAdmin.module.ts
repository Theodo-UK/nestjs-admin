import { Module } from '@nestjs/common'
import { CoreAdminModule } from './coreAdmin.module'
import { AuthAdminModule } from './authAdmin.module'
import DefaultAdminSite from './adminSite'
import AdminUserEntity from './adminUser.entity'

@Module({
  imports: [CoreAdminModule, AuthAdminModule],
  exports: [CoreAdminModule, AuthAdminModule],
})
export default class DefaultAdminModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
