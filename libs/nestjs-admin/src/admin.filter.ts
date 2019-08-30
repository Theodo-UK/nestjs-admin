import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import UnauthenticatedException from './exceptions/unauthenticated.exception'
import { adminUrl } from './admin.filters'

@Catch(UnauthenticatedException)
export class AdminFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()
    res.redirect(adminUrl('login'))
  }
}
