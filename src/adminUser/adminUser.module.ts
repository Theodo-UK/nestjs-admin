import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminAuthModuleFactory } from '../adminAuth/adminAuth.module'
import AdminUser from './adminUser.entity'
import { AdminUserService } from './adminUser.service'

export const adminUserCredentialValidator = {
  imports: [TypeOrmModule.forFeature([AdminUser])],
  useFactory: (adminUserService: AdminUserService) => {
    return adminUserService.validateAdminCredentials.bind(adminUserService)
  },
  inject: [AdminUserService],
}

@Module({
  imports: [
    AdminAuthModuleFactory.createAdminAuthModule({
      credentialValidator: adminUserCredentialValidator,
    }),
  ],
})
export class AdminUserModule {}
