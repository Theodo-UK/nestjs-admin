import * as dotenv from 'dotenv-safe'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { configureAdminApp } from 'nestjs-admin'
import { AppModule } from './app.module'
import { EntityNotFoundFilter } from './exception/entity-not-found.filter'
import { QueryFailedFilter } from './exception/query-failed.filter'

import * as pgConnect from 'connect-pg-simple'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const PgSession = pgConnect(session)
  configureAdminApp(app, {
    session: { store: new PgSession({ conString: process.env.SESSION_DB_URL }) },
  })

  app.useGlobalFilters(new EntityNotFoundFilter())
  app.useGlobalFilters(new QueryFailedFilter())

  await app.listen(8000)
}
bootstrap()
