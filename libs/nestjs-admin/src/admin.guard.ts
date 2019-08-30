import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import UnauthenticatedException from './unauthenticated.exception'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('public', context.getHandler())
    const request = context.switchToHttp().getRequest()

    if (isPublic) {
      return true
    } else {
      if (request.method === 'GET') {
        throw new UnauthenticatedException()
      } else {
        throw new UnauthorizedException()
      }
    }
  }
}
