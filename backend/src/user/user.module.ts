import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserService } from './user.service'
import { AdminModule, AdminSite } from '@app/nestjs-admin'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AdminModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule {
  constructor(private readonly adminSite: AdminSite) {
    adminSite.register('User', User)
  }
}
