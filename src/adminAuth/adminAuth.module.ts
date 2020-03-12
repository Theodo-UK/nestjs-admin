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
  providers: [LocalStrategy],
  controllers: [AdminAuthController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({
    adminCoreModule = defaultCoreModule,
    credentialValidator,
  }: Partial<AdminAuthModuleConfig>) {
    const injectedProviders = credentialValidator.inject || []
    const importedModules = credentialValidator.imports || []
    const credentialValidatorProvider = {
      provide: injectionTokens.ADMIN_AUTH_CREDENTIAL_VALIDATOR,
      useFactory: credentialValidator.useFactory,
      inject: injectedProviders,
    }
    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule, ...importedModules],
      exports: [credentialValidatorProvider, ...injectedProviders],
      providers: [credentialValidatorProvider, ...injectedProviders],
    }
  }
}
