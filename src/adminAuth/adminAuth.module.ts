import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from '../adminUser/adminUser.entity'
import { LocalStrategy } from './local.strategy'
import { AdminAuthController } from './adminAuth.controller'
import { AdminCoreModuleFactory } from '../adminCore/adminCore.module'
import { injectionTokens } from '../tokens'
import { AdminUserService } from '../adminUser/adminUser.service'

const defaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

export type CredentialValidator = (
  username: string,
  password: string,
) => object | null | Promise<object | null>

export interface CredentialValidatorProvider {
  imports?: any[]
  useFactory: (dep: any) => CredentialValidator
  inject?: any[]
}

interface AdminAuthModuleConfig {
  adminCoreModule: any
  credentialValidator: CredentialValidatorProvider
}

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [LocalStrategy],
  controllers: [AdminAuthController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({
    adminCoreModule = defaultCoreModule,
    credentialValidator,
  }: Partial<AdminAuthModuleConfig>) {
    const credentialValidatorProvider = {
      provide: injectionTokens.ADMIN_AUTH_CREDENTIAL_VALIDATOR,
      useFactory: credentialValidator.useFactory,
      inject: credentialValidator.inject,
    }
    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule, ...(credentialValidator.imports || [])],
      exports: [credentialValidatorProvider],
      providers: [credentialValidatorProvider, AdminUserService],
    }
  }
}
