import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { User } from './user.entity'
import { Group } from './group.entity'
import { Agency } from './agency.entity'
import { DefaultAdminSite, DefaultAdminModule } from '@app/nestjs-admin'

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
