import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { DefaultAdminModule } from '@app/nestjs-admin'

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, DefaultAdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
