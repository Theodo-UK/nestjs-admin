import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { DefaultAdminSite, DefaultAdminModule } from 'nestjs-admin'

import { User } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), DefaultAdminModule],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', User)
  }
}
