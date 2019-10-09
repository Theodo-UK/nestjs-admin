import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'
import { AdminUserService } from './adminUser.service'
import InvalidCredentials from './exceptions/invalidCredentials.exception'
import { injectionTokens } from './tokens'
import { CredentialValidator } from './adminAuth.module'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(injectionTokens.ADMIN_AUTH_SERVICE)
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
