import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AdminUserService } from './adminUser.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminUserService: AdminUserService) {
    super()
  }

  async validate(email: string, password: string) {
    const adminUser = await this.adminUserService.validateAdminUser(email, password)
    if (!adminUser) {
      throw new UnauthorizedException()
    }
    return { email: adminUser.username }
  }
}
