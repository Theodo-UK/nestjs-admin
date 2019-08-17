import { Controller } from '@nestjs/common'
import { DefaultAdminController } from '@app/nestjs-admin'

@Controller('admin')
export class AdminController extends DefaultAdminController {}
