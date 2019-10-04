import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'
import { AdminUserService } from './adminUser.service'
import InvalidCredentials from './exceptions/invalidCredentials.exception'
import { injectionTokens } from './tokens'
import { Authenticator } from './adminAuth.module'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(injectionTokens.ADMIN_AUTH_SERVICE)
    private readonly authenticator: Authenticator,
  ) {
    super()
  }

  async validate(email: string, password: string) {
    const adminUser = await this.authenticator(email, password)
    if (!adminUser) {
      throw new InvalidCredentials(email)
    }
    return adminUser
  }
}
