import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import UnauthenticatedException from './exceptions/unauthenticated.exception'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (request.isAuthenticated()) {
      return true
    } else {
      throw new UnauthenticatedException()
    }
  }
}
