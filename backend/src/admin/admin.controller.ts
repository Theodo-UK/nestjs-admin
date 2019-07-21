import { Get, Controller, Render } from '@nestjs/common';
import { AdminSite } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminSite: AdminSite) { }

  @Get()
  @Render('index.njk')
  root() {
    const sections = Object.values(this.adminSite.sections).sort(
      (s1, s2) => s1.name.localeCompare(s2.name)
    )

    return { sections };
  }
}
