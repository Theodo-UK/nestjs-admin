import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { AdminUserService } from './adminUser.service'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { AdminCoreModuleFactory } from './adminCore.module'
import { injectionTokens } from './tokens'

const defaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

export interface AdminAuthModuleConfig {
  adminCoreModule?: any
  adminAuthInterface?: any
}

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [LocalStrategy],
  controllers: [AdminUserController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({
    adminCoreModule = defaultCoreModule,
    adminAuthInterface = AdminUserService,
  }: AdminAuthModuleConfig) {
    const adminUserServiceProvider = {
      provide: injectionTokens.ADMIN_AUTH_SERVICE,
      useValue: adminAuthInterface,
    }
    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule],
      exports: [adminUserServiceProvider, adminAuthInterface],
      providers: [adminUserServiceProvider, adminAuthInterface],
    }
  }
}
