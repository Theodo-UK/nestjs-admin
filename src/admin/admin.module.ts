import { Module } from '@nestjs/common'
import {
  AdminUserEntity,
  DefaultAdminModule,
  AdminUserService,
  AdminModuleFactory,
} from '@app/nestjs-admin'
import { AdminSite } from './admin'
import { AdminController } from './admin.controller'
import { TypeOrmModule } from '@nestjs/typeorm'

export const AdminModuleInstance = AdminModuleFactory.createAdminModule({
  adminSite: AdminSite,
  adminController: AdminController,
})

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity]), AdminModuleInstance],
  providers: [AdminSite, AdminUserService],
  exports: [AdminModuleInstance],
  controllers: [AdminController],
})
export class AdminModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
