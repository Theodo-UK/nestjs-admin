import { HttpException, HttpStatus } from '@nestjs/common'

class UnauthenticatedException extends HttpException {
  constructor() {
    super('Unauthenticated', HttpStatus.UNAUTHORIZED)
  }
}

export default UnauthenticatedException
