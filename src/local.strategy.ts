import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AdminUserService } from './adminUser.service'
import InvalidCredentials from './exceptions/invalidCredentials.exception'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminUserService: AdminUserService) {
    super()
  }

  async validate(username: string, password: string) {
    const adminUser = await this.adminUserService.validateAdminCredentials(username, password)
    if (!adminUser) {
      throw new InvalidCredentials(username)
    }
    return adminUser
  }
}
