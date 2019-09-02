import { Module } from '@nestjs/common'
import { AdminUserEntity, AdminUserService, AdminModuleFactory } from '@app/nestjs-admin'
import { AdminSite } from './admin'
import { AdminController } from './admin.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminUserController } from '@app/nestjs-admin/adminUser.controller'
import { LocalStrategy } from '@app/nestjs-admin/local.strategy'

export const AdminModuleInstance = AdminModuleFactory.createAdminModule({
  adminSite: AdminSite,
  adminController: AdminController,
})

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity]), AdminModuleInstance],
  providers: [AdminSite, AdminUserService, LocalStrategy],
  exports: [AdminModuleInstance],
  controllers: [AdminController, AdminUserController],
})
export class AdminModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
