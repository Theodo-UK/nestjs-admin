import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { DefaultAdminSite } from 'nestjs-admin'
import { BackofficeModule, CustomAdminSite } from '../backoffice/backoffice.module'

import { User } from './user.entity'
import { Group } from './group.entity'
import { Agency } from './agency.entity'
import { UserAdmin } from './user.admin'

@Module({
  imports: [TypeOrmModule.forFeature([User]), BackofficeModule],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: CustomAdminSite) {
    adminSite.register('User', UserAdmin)
    adminSite.register('User', Group)
    adminSite.register('Agency', Agency)
  }
}
