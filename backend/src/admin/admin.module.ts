import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminSite } from './admin.service'
import { AdminNunjucksEnvironment } from './admin.environment'

@Module({
  controllers: [AdminController],
  providers: [AdminSite, AdminNunjucksEnvironment],
  exports: [AdminSite],
})
export class AdminModule {}
