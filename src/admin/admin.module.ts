import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminUser, DefaultAdminModule } from '@app/nestjs-admin'
import { AdminSite } from './admin'
import { AdminController } from './admin.controller'
import { AdminUserSubscriber } from '@app/nestjs-admin/adminUser.service'

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser]), DefaultAdminModule],
  providers: [AdminSite, AdminUserSubscriber],
  exports: [AdminSite],
  controllers: [AdminController],
})
export class AdminModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('Administration', AdminUser)
  }
}
