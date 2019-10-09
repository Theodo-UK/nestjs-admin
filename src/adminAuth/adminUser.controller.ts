import {
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Inject,
  Req,
  UseFilters,
} from '@nestjs/common'
import { Request } from 'express'
import DefaultAdminNunjucksEnvironment from '../adminCore/admin.environment'
import { LoginGuard } from './login.guard'
import { injectionTokens } from '../tokens'
import { adminUrl } from '../adminCore/admin.filters'
import { AdminFilter } from './admin.filter'

@Controller('admin')
@UseFilters(AdminFilter)
export class AdminUserController {
  constructor(
    @Inject(injectionTokens.ADMIN_ENVIRONMENT)
    private env: DefaultAdminNunjucksEnvironment,
  ) {}

  @Get('/login')
  async login(@Req() request: Request) {
    return await this.env.render('login.njk', { request })
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
