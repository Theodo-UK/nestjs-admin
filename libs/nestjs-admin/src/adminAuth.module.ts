import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { AdminUserService } from './adminUser.service'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { AdminCoreModuleFactory } from './adminCore.module'

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [AdminUserService, LocalStrategy],
  controllers: [AdminUserController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({ adminModule = AdminCoreModuleFactory.createAdminCoreModule({}) }) {
    return {
      module: AdminAuthModuleFactory,
      imports: [adminModule],
    }
  }
}
