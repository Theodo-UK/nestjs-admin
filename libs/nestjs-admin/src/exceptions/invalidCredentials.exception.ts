import { HttpException, HttpStatus } from '@nestjs/common'

class InvalidCredentials extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED)
  }
}

export default InvalidCredentials
