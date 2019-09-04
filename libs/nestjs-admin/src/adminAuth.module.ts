import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { AdminUserService } from './adminUser.service'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { AdminCoreModule } from './coreAdmin.module'

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [AdminUserService, LocalStrategy],
  controllers: [AdminUserController],
})
export class AdminAuthModuleFactory {
  static createAdminModule({ adminModule = AdminCoreModule }) {
    return {
      module: AdminAuthModuleFactory,
      imports: [adminModule],
    }
  }
}

export const AdminAuthModule = AdminAuthModuleFactory.createAdminModule({})
