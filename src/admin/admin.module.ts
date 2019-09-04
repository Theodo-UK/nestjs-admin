import { Module } from '@nestjs/common'
import { DefaultAdminModule } from '@app/nestjs-admin'

@Module({
  imports: [DefaultAdminModule],
  exports: [DefaultAdminModule],
})
export class AdminModule {}
