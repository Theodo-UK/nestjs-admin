import { Module, Provider } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AdminAuthController } from './adminAuth.controller';
import { AdminCoreModuleFactory } from '../adminCore/adminCore.module';
import { injectionTokens } from '../tokens';
import { ModuleMetadata } from '@nestjs/common/interfaces';

const defaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({});

/**
 * Function used to check the credentials of the user and its admin status.
 * Returns the user if it is allowed to proceed and access the admin, returns null
 * otherwise.
 */
export type CredentialValidator = (
  username: string,
  password: string,
) => object | null | Promise<object | null>;

export interface CredentialValidatorProvider {
  useFactory: (dep: any) => CredentialValidator;
  inject?: any[];
}

interface AdminAuthModuleConfig {
  adminCoreModule: any;
  /**
   * Provider used to validate the credentials of the user. This provider
   * is expected to be a function, see CredentialValidator type
   */
  credentialValidator: CredentialValidatorProvider;
  /**
   * Modules to import. This is useful to make providers available for
   * injection in the credentialValidator.
   */
  imports: ModuleMetadata['imports'];
  /**
   * Extra providers that will be initialised. This is useful to
   * make providers available for injection in the credentialValidator,
   * when these providers are not provided by a modules of the `imports` param.
   *
   * These providers will be exported.
   */
  providers: ModuleMetadata['providers'];
}

@Module({
  providers: [LocalStrategy],
  controllers: [AdminAuthController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({
    adminCoreModule = defaultCoreModule,
    credentialValidator,
    providers = [],
    imports = [],
  }: Partial<AdminAuthModuleConfig>) {
    const credentialValidatorProvider = {
      provide: injectionTokens.ADMIN_AUTH_CREDENTIAL_VALIDATOR,
      useFactory: credentialValidator.useFactory,
      inject: credentialValidator.inject,
    };

    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule, ...imports],
      exports: [credentialValidatorProvider, ...providers],
      providers: [credentialValidatorProvider, ...providers],
    };
  }
}
