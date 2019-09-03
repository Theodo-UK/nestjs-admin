import * as dotenv from 'dotenv-safe'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as sassMiddleware from 'node-sass-middleware'
import { join } from 'path'
import { AppModule } from './app.module'
import { EntityNotFoundFilter } from './exception/entity-not-found.filter'
import { QueryFailedFilter } from './exception/query-failed.filter'
import { isDevEnvironment } from './utils/environment'

import * as session from 'express-session'
import * as passport from 'passport'

const publicFolder = join(__dirname, '..', 'public')
const assetPrefix = '/static'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(
    sassMiddleware({
      src: publicFolder + '/scss',
      dest: publicFolder + '/css',
      prefix: assetPrefix + '/css',
      outputStyle: isDevEnvironment() ? 'expanded' : 'compressed',
      sourceMap: isDevEnvironment(),
      debug: isDevEnvironment(),
    }),
  )

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
    }),
  )

  app.use(passport.initialize())
  app.use(passport.session())

  // @debt architecture "miker: should be done by session.serializer.ts in lib"
  passport.serializeUser(function(user: any, done: (err: Error, user: any) => void): any {
    done(null, user)
  })
  passport.deserializeUser(function(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): any {
    done(null, payload)
  })

  app.useStaticAssets(publicFolder, { prefix: assetPrefix })

  // needs to be after the sassMiddleware
  app.useStaticAssets(publicFolder, { prefix: assetPrefix })

  app.useGlobalFilters(new EntityNotFoundFilter())
  app.useGlobalFilters(new QueryFailedFilter())

  await app.listen(8000)
}
bootstrap()
