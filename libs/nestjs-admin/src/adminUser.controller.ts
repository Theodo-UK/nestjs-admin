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

  async render(name: string, context?: object) {
    const prom = new Promise((resolve, reject) => {
      this.env.env.render(name, context, function(err, res) {
        if (err) {
          reject(err)
          return err
        }
        resolve(res)
        return res
      })
    })
    const rendered = await prom
    return rendered
  }

  @Get('/login')
  async login() {
    return await this.render('login.njk')
  }

  @HttpCode(200)
  @UseGuards(LoginGuard)
  @Post('/login')
  async adminLogin(@Res() res: any) {
    res.redirect('/admin')
  }
}
