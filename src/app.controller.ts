import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hey you! You probably want to head to <a href="/admin">/admin</a>'
  }
}
