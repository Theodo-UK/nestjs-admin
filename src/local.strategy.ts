import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'
import InvalidCredentials from './adminAuth/exceptions/invalidCredentials.exception'
import { injectionTokens } from './tokens'
import { CredentialValidator } from './adminAuth/adminAuth.module'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(injectionTokens.ADMIN_AUTH_CREDENTIAL_VALIDATOR)
    private readonly credentialValidator: CredentialValidator,
  ) {
    super()
  }

  async validate(username: string, password: string) {
    const adminUser = await this.credentialValidator(username, password)
    if (!adminUser) {
      throw new InvalidCredentials(username)
    }
    return adminUser
  }
}
