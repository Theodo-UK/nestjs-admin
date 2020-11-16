import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { DefaultAdminSite } from 'nestjs-admin'
import { BackofficeModule } from '../backoffice/backoffice.module'

import { User } from './user.entity'
import { Group } from './group.entity'
import { Agency } from './agency.entity'
import { UserAdmin } from './user.admin'

@Module({
  imports: [TypeOrmModule.forFeature([User]), BackofficeModule],
  controllers: [],
  providers: [UserAdmin],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(adminSite: DefaultAdminSite, userAdmin: UserAdmin) {
    adminSite.register('User', userAdmin)
    adminSite.register('Group', Group)
    adminSite.register('Agency', Agency)
  }
}
