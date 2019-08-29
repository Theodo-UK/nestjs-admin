import { HttpException, HttpStatus } from '@nestjs/common'

class LoginException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN)
  }
}

export default LoginException
