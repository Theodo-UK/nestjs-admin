import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
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
      switch (request.method) {
        case 'GET':
          throw new UnauthenticatedException()
        case 'POST':
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
      }
    }
  }
}
