import { Module } from '@nestjs/common'
import { DefaultAdminModule } from '@app/nestjs-admin'
import { AdminSite } from './admin.site'
import { AdminController } from './admin.controller'

@Module({
  imports: [DefaultAdminModule],
  providers: [AdminSite],
  exports: [AdminSite],
  controllers: [AdminController],
})
export class AdminModule {}
