import { Module } from '@nestjs/common'
import * as pgConnect from 'connect-pg-simple'
import * as session from 'express-session'
import { AdminCoreModuleFactory, AdminAuthModuleFactory } from 'nestjs-admin'

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
  adminCoreModule: AdminCoreModule,
})

@Module({
  imports: [AdminCoreModule, AdminAuthModule],
  exports: [AdminCoreModule, AdminAuthModule],
})
export class BackofficeModule {}
