import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { AdminUserService } from './adminUser.service'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { DefaultAdminModule } from './admin.module'

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity]), DefaultAdminModule],
  providers: [AdminUserService, LocalStrategy],
  controllers: [AdminUserController],
  exports: [],
})
export class DefaultAdminUserModule {}
