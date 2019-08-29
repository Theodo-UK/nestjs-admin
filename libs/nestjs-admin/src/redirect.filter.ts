import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import LoginException from './login.exception'

@Catch(LoginException)
export class RedirectFilter implements ExceptionFilter {
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
