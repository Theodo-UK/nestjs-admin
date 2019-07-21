import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AdminSite } from '../admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';

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
