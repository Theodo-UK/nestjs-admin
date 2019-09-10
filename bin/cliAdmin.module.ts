import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import AdminUser from '../src/adminUser.entity'
import { AdminUserService } from '../src/adminUser.service'

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([AdminUser])],
  providers: [AdminUserService], // @debt TODO "Import DefaultAdminAuthModule instead"
})
export class CliAdminModule {}
