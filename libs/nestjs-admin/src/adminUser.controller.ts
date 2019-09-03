import { Controller, Get, HttpCode, Post, UseGuards, Res, Inject, Req } from '@nestjs/common'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import { LoginGuard } from './login.guard'
import { injectionTokens } from './tokens'
import { adminUrl } from './admin.filters'

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

  @Post('/logout')
  async logout(@Req() req: any, @Res() res: any) {
    req.logout()
    res.redirect(adminUrl('login'))
  }
}
