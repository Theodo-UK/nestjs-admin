import { Module } from '@nestjs/common'
import { DefaultAdminController } from './admin.controller'
import DefaultAdminSite from './adminSite'
import DefaultAdminNunjucksEnvironment from './admin.environment'

@Module({
  controllers: [DefaultAdminController],
  providers: [DefaultAdminSite, DefaultAdminNunjucksEnvironment],
  exports: [DefaultAdminSite, DefaultAdminNunjucksEnvironment],
})
export class DefaultAdminModule {}
