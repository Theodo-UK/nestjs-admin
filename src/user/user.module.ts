import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { User } from './user.entity'
import { AdminModule, AdminSite } from '@app/nestjs-admin'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AdminModule],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('User', User)
  }
}
