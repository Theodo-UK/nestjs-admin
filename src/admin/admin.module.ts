import { Module } from '@nestjs/common'
import {
  AdminUserEntity,
  AdminUserService,
  AdminModuleFactory,
  AdminUserController,
  LocalStrategy,
} from 'nestjs-admin'
import { AdminSite } from './admin'
import { AdminController } from './admin.controller'
import { TypeOrmModule } from '@nestjs/typeorm'

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
