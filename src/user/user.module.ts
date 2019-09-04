import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { DefaultAdminSite, DefaultAdminModule } from '@app/nestjs-admin'

import { User } from './user.entity'
import { Group } from './group.entity'
import { Agency } from './agency.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), DefaultAdminModule],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', User)
    adminSite.register('User', Group)
    adminSite.register('Agency', Agency)
  }
}
