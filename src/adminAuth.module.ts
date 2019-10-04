import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { AdminUserService } from './adminUser.service'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { AdminCoreModuleFactory } from './adminCore.module'
import { injectionTokens } from './tokens'
import AdminUser from './adminUser.entity'
import { Repository } from 'typeorm'

const defaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

export type Authenticator = (email: string, pass: string) => object | null | Promise<object | null>

export interface AdminAuthenticator {
  imports: any[]
  useFactory: (dep: any) => Authenticator
  inject: any[]
}

export const AdminUserAuthenticator = {
  imports: [TypeOrmModule.forFeature([AdminUser])],
  // @ts-ignore
  useFactory: (adminUserRepository: Repository<AdminUser>) => {
    return async function validateCredentials(email: string, pass: string) {
      const user: AdminUser | null = await adminUserRepository.findOne(email)
      if (user && pass === user.password) {
        return user
      }
      return null
    }
  },
  inject: [getRepositoryToken(AdminUser)],
}

interface AdminAuthConfig {
  adminCoreModule: any
  authenticator: AdminAuthenticator
}

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [LocalStrategy],
  controllers: [AdminUserController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({
    adminCoreModule = defaultCoreModule,
    authenticator = AdminUserAuthenticator,
  }: Partial<AdminAuthConfig>) {
    const adminUserServiceProvider = {
      provide: injectionTokens.ADMIN_AUTH_SERVICE,
      useFactory: authenticator.useFactory,
      inject: authenticator.inject,
    }
    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule, ...authenticator.imports],
      exports: [adminUserServiceProvider],
      providers: [adminUserServiceProvider],
    }
  }
}
