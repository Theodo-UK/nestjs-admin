import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { AdminUserService } from './adminUser.service'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { AdminCoreModuleFactory } from './adminCore.module'

const defaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

export interface AdminAuthModuleConfig {
  adminCoreModule?: any
}

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [AdminUserService, LocalStrategy],
  controllers: [AdminUserController],
  exports: [AdminUserService],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({ adminCoreModule = defaultCoreModule }: AdminAuthModuleConfig) {
    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule],
    }
  }
}
