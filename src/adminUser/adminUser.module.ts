import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthModuleFactory } from '../adminAuth/adminAuth.module';
import AdminUser from './adminUser.entity';
import { AdminUserService } from './adminUser.service';
import AdminUserEntity from './adminUser.entity';

const adminUserCredentialValidator = {
  imports: [TypeOrmModule.forFeature([AdminUser])],
  useFactory: (adminUserService: AdminUserService) => {
    return adminUserService.validateAdminCredentials.bind(adminUserService);
  },
  inject: [AdminUserService],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUserEntity]),
    AdminAuthModuleFactory.createAdminAuthModule({
      credentialValidator: adminUserCredentialValidator,
      imports: [AdminUserModule]
    }),
  ],
  exports: [AdminAuthModuleFactory, AdminUserService],
  providers: [AdminAuthModuleFactory, AdminUserService],
})
export class AdminUserModule {}
