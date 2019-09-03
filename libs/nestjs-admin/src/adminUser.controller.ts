import { Controller, Get, HttpCode, Post, UseGuards, Res } from '@nestjs/common'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import { AdminUserService } from './adminUser.service'
import { LoginGuard } from './login.guard'

@Controller('admin')
export class AdminUserController {
  constructor(
    private defaultEnv: DefaultAdminNunjucksEnvironment,
    private readonly adminUserService: AdminUserService,
  ) {}

  get env() {
    return this.defaultEnv
  }

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
