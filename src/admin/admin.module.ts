import { AdminModuleFactory } from '@app/nestjs-admin'
import { AdminSite } from './admin'
import { AdminController } from './admin.controller'

export const AdminModule = AdminModuleFactory.createAdminModule({
  adminSite: AdminSite,
  adminController: AdminController,
})
