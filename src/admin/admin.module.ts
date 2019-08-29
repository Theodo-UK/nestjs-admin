import { Module } from '@nestjs/common'
import { AdminUserEntity, DefaultAdminModule } from '@app/nestjs-admin'
import { AdminSite } from './admin'
import { AdminController } from './admin.controller'

@Module({
  imports: [DefaultAdminModule],
  providers: [AdminSite],
  exports: [AdminSite],
  controllers: [AdminController],
})
export class AdminModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('AdminUser', AdminUserEntity)
  }
}
