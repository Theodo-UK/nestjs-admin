import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { AdminCoreModuleFactory } from './adminCore.module'
import { injectionTokens } from './tokens'
import AdminUser from './adminUser.entity'
import { Repository } from 'typeorm'
import { compareSync } from 'bcryptjs'

const defaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

export type CredentialValidator = (
  email: string,
  pass: string,
) => object | null | Promise<object | null>

export interface CredentialValidatorProvider {
  imports?: any[]
  useFactory: (dep: any) => CredentialValidator
  inject?: any[]
}

export const AdminUserCredentialValidator = {
  imports: [TypeOrmModule.forFeature([AdminUser])],
  useFactory: (adminUserRepository: Repository<AdminUser>) => {
    return async function validateCredentials(email: string, password: string) {
      const adminUser: AdminUser | null = await adminUserRepository.findOne(email)
      if (adminUser && compareSync(password, adminUser.password)) {
        return adminUser
      }
      return null
    }
  },
  inject: [getRepositoryToken(AdminUser)],
}

interface AdminAuthModuleConfig {
  adminCoreModule: any
  credentialValidator: CredentialValidatorProvider
}

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [LocalStrategy],
  controllers: [AdminUserController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({
    adminCoreModule = defaultCoreModule,
    credentialValidator = AdminUserCredentialValidator,
  }: Partial<AdminAuthModuleConfig>) {
    const adminUserServiceProvider = {
      provide: injectionTokens.ADMIN_AUTH_SERVICE,
      useFactory: credentialValidator.useFactory,
      inject: credentialValidator.inject,
    }
    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule, ...(credentialValidator.imports || [])],
      exports: [adminUserServiceProvider],
      providers: [adminUserServiceProvider],
    }
  }
}
