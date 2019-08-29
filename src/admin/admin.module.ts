import { Module } from '@nestjs/common'
import { AdminUserEntity, DefaultAdminModule } from '@app/nestjs-admin'
import { AdminSite } from './admin'
import { AdminController } from './admin.controller'
import { AdminUserSubscriber } from '@app/nestjs-admin/adminUser.service'

@Module({
  imports: [DefaultAdminModule],
  providers: [AdminSite, AdminUserSubscriber],
  exports: [AdminSite],
  controllers: [AdminController],
})
export class AdminModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
