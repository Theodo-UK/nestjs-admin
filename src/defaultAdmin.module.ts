import { Module } from '@nestjs/common';
import { AdminCoreModuleFactory } from './adminCore/adminCore.module';
import DefaultAdminSite from './adminCore/adminSite';
import AdminUserEntity from './adminUser/adminUser.entity';
import { AdminUserModule } from './adminUser/adminUser.module';

const DefaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({});

@Module({
  imports: [DefaultCoreModule, AdminUserModule],
  exports: [DefaultCoreModule, AdminUserModule],
})
export default class DefaultAdminModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Administration', AdminUserEntity);
  }
}
