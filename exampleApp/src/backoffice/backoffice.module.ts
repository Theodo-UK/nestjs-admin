import { Module, Injectable } from '@nestjs/common'
import * as pgConnect from 'connect-pg-simple'
import * as session from 'express-session'
import {
  AdminCoreModuleFactory,
  AdminAuthModuleFactory,
  DefaultAdminSite,
  AdminUserEntity,
} from 'nestjs-admin'

@Injectable()
export class CustomAdminSite extends DefaultAdminSite {
  loginInfo = 'Please provide admin credentials to access the administration'
}

const sessionDBUrl = process.env.SESSION_DB_URL
const PgSession = pgConnect(session)
const AdminCoreModule = AdminCoreModuleFactory.createAdminCoreModule({
  adminSite: CustomAdminSite,
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
export class BackofficeModule {
  constructor(private readonly adminSite: CustomAdminSite) {
    adminSite.register('Administration', AdminUserEntity)
  }
}
