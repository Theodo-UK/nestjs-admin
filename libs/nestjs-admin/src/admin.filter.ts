import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { adminUrl } from './admin.filters'
import InvalidCredentials from './exceptions/invalidCredentials.exception'

@Catch(UnauthorizedException, ForbiddenException, InvalidCredentials)
export class AdminFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()
    const req = host.switchToHttp().getRequest()

    if (exception instanceof InvalidCredentials) {
      req.flash('loginError', 'Invalid credentials')
    }
    res.redirect(adminUrl('login'))
  }
}
