import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DefaultAdminModule } from 'nestjs-admin'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, DefaultAdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
