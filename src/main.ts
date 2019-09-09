import * as dotenv from 'dotenv-safe'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { configureAdminApp, publicFolder } from 'nestjs-admin'
import * as sassMiddleware from 'node-sass-middleware'
import { AppModule } from './app.module'
import { EntityNotFoundFilter } from './exception/entity-not-found.filter'
import { QueryFailedFilter } from './exception/query-failed.filter'

import * as pgConnect from 'connect-pg-simple'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(
    sassMiddleware({
      src: publicFolder + '/scss',
      dest: publicFolder + '/css',
      prefix: '/admin-static/css',
      outputStyle: 'expanded',
      sourceMap: true,
      debug: true,
    }),
  )

  const PgSession = pgConnect(session)
  configureAdminApp(app, {
    session: { store: new PgSession({ conString: process.env.SESSION_DB_URL }) },
  })

  app.useGlobalFilters(new EntityNotFoundFilter())
  app.useGlobalFilters(new QueryFailedFilter())

  await app.listen(8000)
}
bootstrap()
