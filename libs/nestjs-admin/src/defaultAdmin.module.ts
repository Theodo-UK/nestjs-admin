import { Module } from '@nestjs/common'
import { CoreAdminModule } from './admin.module'
import { DefaultAdminUserModule } from './adminUser.module'
import DefaultAdminSite from './adminSite'
import AdminUserEntity from './adminUser.entity'

@Module({
  imports: [CoreAdminModule, DefaultAdminUserModule],
  exports: [CoreAdminModule, DefaultAdminUserModule],
})
export default class DefaultAdminModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
