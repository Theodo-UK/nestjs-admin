import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { AdminModule } from '@/admin/admin.module'
import { AdminSite } from '@/admin/admin'
import { User } from './user.entity'
import { Group } from './group.entity'
import { Agency } from './agency.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AdminModule],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('User', User)
    adminSite.register('User', Group)
    adminSite.register('Agency', Agency)
  }
}
