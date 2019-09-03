import { Controller, Get, HttpCode, Post, UseGuards, Res, Inject } from '@nestjs/common'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import { LoginGuard } from './login.guard'
import { injectionTokens } from './tokens'

@Controller('admin')
export class AdminUserController {
  constructor(
    @Inject(injectionTokens.ADMIN_ENVIRONMENT)
    private env: DefaultAdminNunjucksEnvironment,
  ) {}

  @Get('/login')
  async login() {
    return await this.env.render('login.njk')
  }

  @HttpCode(200)
  @UseGuards(LoginGuard)
  @Post('/login')
  async adminLogin(@Res() res: any) {
    res.redirect('/admin')
  }
}
