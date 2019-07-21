import { Get, Controller, Render } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get()
  @Render('index.njk')
  root() {
    return { message: 'Hello world!' };
  }
}
