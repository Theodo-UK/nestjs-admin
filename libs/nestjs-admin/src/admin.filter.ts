import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import UnauthenticatedException from './unauthenticated.exception'

@Catch(UnauthenticatedException)
export class AdminFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse()
    try {
      res.redirect('/admin/login')
    } catch (e) {
      return res.status(500).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      })
    }
  }
}
