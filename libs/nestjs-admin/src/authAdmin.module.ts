import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { AdminUserService } from './adminUser.service'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { CoreAdminModule } from './coreAdmin.module'

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [AdminUserService, LocalStrategy],
  controllers: [AdminUserController],
})
export class AuthAdminModuleFactory {
  static createAdminModule({ adminModule = CoreAdminModule }) {
    return {
      module: AuthAdminModuleFactory,
      imports: [adminModule],
    }
  }
}

export const AuthAdminModule = AuthAdminModuleFactory.createAdminModule({})
