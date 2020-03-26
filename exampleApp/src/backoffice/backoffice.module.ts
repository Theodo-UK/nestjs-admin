import { Module } from '@nestjs/common'
import * as pgConnect from 'connect-pg-simple'
import * as session from 'express-session'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  AdminCoreModuleFactory,
  AdminAuthModuleFactory,
  DefaultAdminSite,
  AdminUserEntity,
} from 'nestjs-admin'
import { UserCredentialValidator } from '../user/userCredentialValidator'
import { User } from '../user/user.entity'

const sessionDBUrl = process.env.SESSION_DB_URL
const PgSession = pgConnect(session)
const AdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({
  appConfig: {
    session: {
      store:
        sessionDBUrl && sessionDBUrl !== 'false'
          ? new PgSession({ conString: sessionDBUrl })
          : undefined,
    },
  },
})

const AdminAuthModule = AdminAuthModuleFactory.createAdminAuthModule({
  credentialValidator: UserCredentialValidator,
  imports: [TypeOrmModule.forFeature([User])],
})

@Module({
  imports: [AdminCoreModule, AdminAuthModule],
  exports: [AdminCoreModule, AdminAuthModule],
})
export class BackofficeModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
