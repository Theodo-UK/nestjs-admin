import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { adminUrl } from '../adminCore/admin.filters'
import InvalidCredentials from './exceptions/invalidCredentials.exception'

@Catch(UnauthorizedException, ForbiddenException, InvalidCredentials)
export class AdminFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()
    const req = host.switchToHttp().getRequest()

    if (exception instanceof InvalidCredentials) {
      req.flash('loginError', 'Invalid credentials')
      req.flash('username', exception.username)
    }
    res.redirect(adminUrl('login'))
  }
}
