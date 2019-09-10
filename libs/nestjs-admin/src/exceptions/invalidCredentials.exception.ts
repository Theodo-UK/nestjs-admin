import { HttpException, HttpStatus } from '@nestjs/common'

class InvalidCredentials extends HttpException {
  constructor(public readonly username: string) {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED)
  }
}

export default InvalidCredentials
